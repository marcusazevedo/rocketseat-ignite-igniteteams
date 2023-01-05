import { playersGetAllByGroup } from './playersGetAllByGroup';

export async function playersGetByGroupAnTeam(group: string, team: string){
  try {
    const storage = await playersGetAllByGroup(group);

    const players = storage.filter(player => player.team === team);

    return players;
  } catch (error) {
    throw error
  }
}
