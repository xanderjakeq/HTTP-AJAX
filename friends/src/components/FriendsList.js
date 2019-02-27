import React , {Component} from 'react'
import axios from 'axios'

export default class extends Component {
    constructor(props){
        super(props)
        
        this.state = {

        }
    }

    

    componentDidMount(){
        this.getFriends()
    }

    getFriends = () => {
        axios.get('http://localhost:5000/friends').then(data => {
            console.log(data)
            this.setState({
                friends: data.data
            })
        }).catch(err => {
            console.log(err)
        })
    }

    handleSubmit = async e => {
        e.preventDefault()
        let currState = this.state
        if(currState.name && currState.age && currState.email){
            await axios.post('http://localhost:5000/friends', {
                name: currState.name,
                age: currState.age,
                email: currState.email
            }).then(res => {
                this.setState({
                    name: null,
                    age: null,
                    email: null
                }) 
            }).catch(err => {
                console.log(err)
            })
            this.getFriends()
            
        }else{
            alert('please complete the form.')
        }
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        return(
            <>
                <AddFriendForm submit = {this.handleSubmit} onChange = {this.handleChange} name = {this.state.name} age = {this.state.age} email = {this.state.email}/>
                {this.state.friends ? 
                    this.state.friends.map(friend => {
                        return <Friend key = {friend.id} data = {friend}/>
                    }) 
                    :
                    'loading'
                }
            </>
        )
    }
}

const AddFriendForm = (props) => {
    return (
        <form onSubmit = {props.submit}>
            <input name = 'name' type = 'text' value = {props.name ? props.name : ''} onChange = {props.onChange}/>
            <input name = 'age' type = 'number' value = {props.age? props.age : ''} onChange = {props.onChange}/>
            <input name = 'email' type = 'text' value = {props.email? props.email : ''} onChange = {props.onChange}/>
            <input type = 'submit' value = 'add Frwend'/>
        </form>
    )
}

const Friend = (props) => {
    const {name, age, email} = props.data
    return (
        <div>
            <h1>{name}</h1>
            <h3>{age}</h3>
            <h5>{email}</h5>
        </div>
    )
}