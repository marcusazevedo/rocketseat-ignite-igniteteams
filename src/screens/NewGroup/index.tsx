import React, { useState } from 'react';
import { Button } from '@components/Button';
import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Container, Content, Icon } from './styles';
import { Input } from '@components/Input';
import { useNavigation } from '@react-navigation/native';

export function NewGroup() {
  const [group, setGroup] = useState('');
  const navigation = useNavigation();

  function handleNewGroup(){
    navigation.navigate('players', { group });
  }
  return (
    <Container>
      <Header showBackButton/>

      <Content>
        
        <Icon/>

        <Highlight 
          title='Nova turma' 
          subtitle='Crie uma turma para adicionar as pessoas'/>

        <Input 
          placeholder='Nome da turma' 
          onChangeText={setGroup}
        />

        <Button 
          title='Criar' 
          style={{ marginTop: 20 }}
          onPress={handleNewGroup}
        />  

      </Content>

    </Container>
  );
}