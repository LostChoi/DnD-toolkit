import React from 'react';

import {CharacterInfo} from './base.jsx';

class TeamBuilder extends React.Component {
    constructor(props){
        super(props);
	this.state = {
		characters: props.characters,
		teams: props.teams,
		teamNumber:null
	}
	this.updateTeams = newTeams => {
		this.setState({teams:newTeams});
		props.updateLibrary(newTeams);
	}
    }
    componentWillReceiveProps(props){
	    this.setState(props);
    }
    render(){
	let teamNumber = this.state.teamNumber;
	let char = id => this.state.characters.filter(char=>char.id==id)[0];
        return <div>
		<h2>Teams</h2>
		<ul>
			<li key='new'>
				<input
					id="new team name"
					defaultValue="new team name"
				/>
				<button onClick={()=>this.newTeam()}> + </button>
			</li>
			{this.state.teams.length!=0?
				this.state.teams.map((team,index)=>
					<li key={index}>
					<button onClick={()=>this.setState({teamNumber:index})}> {team.name} </button>
					<button onClick={()=>this.remove(index)}>-</button>
				</li>
				) 
			:"Make some teams." }
		</ul>
		<h2>Members</h2>
		{this.state.teamNumber!=null?<div>
			<ul>
				{Object.keys(this.state.teams[teamNumber].members).map(id => 
					<li key={id}>
						{this.state.teams[teamNumber].members[id]}
						<CharacterInfo character={char(id)}/>
					</li>
				)}
			</ul> 
			<h2>Characters</h2>
			<ul>
				{this.state.characters.map(character=>
					<li key={character.id}>
						<button onClick={()=>this.addCharacter(character.id)}>&lt;</button>
						<CharacterInfo character={character}/>
					</li>
				) }
			</ul>
		</div>: 'No team is selected.'}
        </div>;
    }
    newTeam(){
	   let newTeams = this.state.teams.slice();
	   newTeams.push({
		   name:document.getElementById("new team name").value,
		   members:{}
	   });
	   this.updateTeams(newTeams);
    }
    addCharacter(id){
	    let teamNumber = this.state.teamNumber;
	    let newTeams = this.state.teams.slice();
	    if(null==newTeams[teamNumber].members[id]){
		    newTeams[teamNumber].members[id]  = 1;
	    }else{
		    newTeams[teamNumber].members[id] += 1;
	    }
	    this.updateTeams(newTeams);
	}
}

export {TeamBuilder};
