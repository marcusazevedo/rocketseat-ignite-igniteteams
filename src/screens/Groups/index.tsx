import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { GroupCard } from '@components/GroupCard';
import { useNavigation } from '@react-navigation/native';

import { Container } from './styles';
import { useState } from 'react';
import { FlatList } from 'react-native';
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

export function Groups() {
  const [groups, setGroups] = useState([]);

  const navigation = useNavigation();

  function handleNewGroup() {
    navigation.navigate('newgroup');
  }

  return (
    <Container>
      <Header />  

      <Highlight title='Turmas' subtitle='jogue com a sua turma'/> 
      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({ item }) => (
          <GroupCard title={item}/>
        )}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <ListEmpty 
            message='Que tal cadastrar a primeira turma?'
          />
        )}
      />

      <Button 
        title='Criar nova turma'
        onPress={handleNewGroup}
      />      
    </Container>
  );
}
