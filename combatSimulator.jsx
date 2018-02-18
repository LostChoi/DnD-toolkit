import React from 'react';

function initiative(){
    let t1 = roll(6);
    let t2 = roll(6);
    if(t1 < t2)
        return -1;
    if (t2 > t1)
        return 1;
    return 0;
}

function roll(num){
    return Math.floor(Math.random() * num) + 1;
}

function makeTeam(almostTeam) {
    let i = 0;
    keyList = almostTeam.keys();
    let team = null;
    while (i < keyList.length) {
        let j = 0;
        let num = almostTeam[keyList[i]];
        while(j < num){
            let newChar = this.state.characters.filter(char => char.id == keyList[i])[0];
            team.add(newChar);
            j++;
        }
        i++;
    }
    return team;
}

function attack(job, hitMod, dmgMod, ac){
    let hit = roll(20) + hitMod;
    if(ac < -3){
        if(hit < 20 + Math.abs(3 - ac))
            return 0;
        return chooseDmg(job) + dmgMod;
    }if(ac > -3 && ac <3){
        if(hit < 20)
            return 0;
        return chooseDmg(job) + dmgMod;
    }if(ac > 2){
        if(hit < 22-ac)
            return 0;
        return chooseDmg(job) + dmgMod;
    }
}

function combat(team1, team2, superString){
    while(team1.length != 0 && team2.length != 0){
        let init = initiative();
        if(init == -1){
            superString = assault(team1, team2, superString);
            superString = destroy(team2, superString);
            superString = assault(team2, team1, superString);
            superString = destroy(team1, superString);
        } else if (init == 0){
            superString = assault(team1, team2, superString);
            superString = assault(team2, team1, superString);
            superString = destroy(team1, superString);
            superString = destroy(team2, superString);
        } else{
            superString = assault(team2, team1, superString);
            superString = destroy(team1, superString);
            superString = assault(team1, team2, superString);
            superString = destroy(team2, superString);
        }
    }
    return superString;
}

function destroy(team, superString){
    let i = 0;
    while(i < team.length){
        if(team[i].hp < 0){
            team[i].remove();
            superString.concat("\n " + team[i].name + " has died!");
        }
        else
            i++;
    }
    return {team, superString};
}

function assault(team1, team2, superString){
    let i = 0;
    while(i < team1.length){
        let target = roll(team2.length)-1;
        dmg = attack(team1[i].job, team1[i].hitMod, team1[i].dmgMod, team2[target].ac);
        team2[target].hp -= dmg;
        if(dmg != 0)
            superString.concat("\n " + team1[i].name + " has dealt " + dmg + " damage to " + team2[target].name + "!")
        i++;
    }
    return {team2, superString};
}

function chooseDmg(job) {
    if(job == "MU" || job == "fighter")
        return roll(4)+roll(4);
    if(job == "thief")
        return roll(4);
    if(job == "cleric")
        return roll(4)+1;
}

import {CharacterInfo} from './base.jsx';

class Fight extends React.Component {
	constructor(props){
		super(props);
		this.state=props;
	}
	render(){
	}
}

class TeamViewer extends React.Component {
	constructor(props){
		super(props);
		this.state=props;
		"team, characters"
	}
	render(){
		let getCharacter=(id)=>this.state.characters.filter(character=>character.id==id)[0];
		return this.state.team?
			<div>
				<h1>{this.state.team.name}</h1>
				<ul>
					{Object.keys(this.state.team.members).map(character=>
						<li key={character.id}>
							<CharacterInfo character={getCharacter(character.id)}/>
						</li>
					)}
				</ul>
			</div>:
			"none.";

	}
}
class TeamSelect extends React.Component {
	constructor(props){
		super(props);
		this.state=props;
	}
	render(){
		return <div>
			<TeamViewer
				team={this.state.team1}
				characters={this.state.characters}
			/>
			<ul>
				{this.state.teams.map((team,index)=>
					<li key={index}>
						{team.name}
						<button onClick={()=>this.setState({team1:team})}>&lt;-</button>
						<button onClick={()=>this.setState({team1:team})}>-&gt;</button>
					</li>
				)}
			</ul>
			<TeamViewer
				team={this.state.team1}
				characters={this.state.characters}
			/>
			<button onClick={()=>this.state.fight()}>Go</button>
		</div>;
	}
}


class CombatSimulator extends React.Component {
	constructor(props){
		super(props);
		this.state=Object.assign(
			{
				stage:'teamselect',
				team1:null,
				team2:null
			},
			props
		);
	}
	render(){
		return (<div>
			{
				{
					'teamselect': <TeamSelect
						team1={this.state.team1}
						team2={this.state.team2}
						teams={this.state.teams}
						characters={this.state.characters}
					/>,
					'fite': <Fight
						teams={this.state.teams}
						characters={this.state.characters}
					/>
				}[this.state.stage]
			}
		</div>);
	}
}

export {CombatSimulator};
