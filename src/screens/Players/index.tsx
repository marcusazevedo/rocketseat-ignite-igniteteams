import React, { useState, useEffect, useRef } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Container, Form, HeaderList, NumberOfPlayers } from './styles';
import { ButtonIcon } from '@components/ButtonIcon';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { Alert, FlatList, Keyboard, TextInput } from 'react-native';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';
import { AppError } from '@utils/AppError';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAnTeam } from '@storage/player/playersGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

type RouteParams = {
  group: string;
}

export function Players() {
  const [newPlayerName, setNewPlayerName] = useState('');
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);

  const route = useRoute();
  const navitation = useNavigation();
  const { group } = route.params as RouteParams;

  const newPlayerNameInputRef = useRef<TextInput>(null);

  async function handleAddPlayer(){
    if(newPlayerName.trim().length === 0){
      return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.')
    }

    const newPlayer = {
      name: newPlayerName,
      team,
    }

    try {
      await playerAddByGroup(newPlayer, group);

      newPlayerNameInputRef.current?.blur();
      Keyboard.dismiss();

      setNewPlayerName('');
      fetchPlayerByTeam();

    } catch (error){
      if(error instanceof AppError){
        Alert.alert('Nova pessoa', error.message)

    } else {
      console.log(error);
      Alert.alert('Nova pessoa', 'Não foi possível adicionar a pessoa.');
    }
  }
}

  async function fetchPlayerByTeam(){
    try {
      const playersByTeam = await playersGetByGroupAnTeam(group, team);
      setPlayers(playersByTeam);
    } catch(error){
      console.log(error);
      Alert.alert('Pessoas', 'Não foi possível carregar as pessoas filtradas pelo time.')
    }
  }

  async function handlePlayerRemove(playerName: string){
    try {
      await playerRemoveByGroup(playerName, group);
      fetchPlayerByTeam();

    } catch(error){
      console.log(error);
      Alert.alert('Remover pessoa', 'Não foi possível remver essa pessoa.')
    }
  }

  async function groupRemove(){
    try {
      await groupRemoveByName(group);
      navitation.navigate('groups');
    } catch(error){
      console.log(error)
      Alert.alert('Erro', 'Não foi possível remver o grupo.')
    }
  }

  async function handleGroupRemove(){
    Alert.alert(
      'Remover',
      'Tem certeza que deseja remover o grupo?',
      [
        { text: 'Não', style: 'cancel'},
        { text: 'Sim', onPress: () => groupRemove()}
      ]
    )
  }

  useEffect(() => {
    fetchPlayerByTeam();
  }, [team])

  return (
    <Container>
      <Header showBackButton/>

      <Highlight
        title={group}
        subtitle='Adicione a galera e separe os times'
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          onChangeText={setNewPlayerName}
          value={newPlayerName}
          placeholder='Nome da pessoa'
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType='done'
        />
        <ButtonIcon icon='add' onPress={handleAddPlayer}/>
      </Form>

      <HeaderList>
        <FlatList
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      <FlatList
        data={players}
        keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <PlayerCard
            name={item.name}
            onRemove={() => handlePlayerRemove(item.name)}
          />
        )}

        contentContainerStyle={[
          {paddingBottom: 70},
          players.length === 0 && {flex: 1}
        ]}
        ListEmptyComponent={() => (
          <ListEmpty
            message='Não existem pessoas nesse time.'
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <Button
        title='Remover turma'
        type='SECONDARY'
        onPress={handleGroupRemove}
      />
    </Container>
  )
}
