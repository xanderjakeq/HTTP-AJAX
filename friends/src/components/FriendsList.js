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

    handleDelete = (id) => {
        axios.delete(`http://localhost:5000/friends/${id}`).then(res => {
            console.log(res)
            this.getFriends()
        }).catch(err => {
            console.log(err)
        })
    }

    handleChange = e => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    render(){
        return(
            <>
                <FriendForm write submit = {this.handleSubmit} onChange = {this.handleChange} name = {this.state.name} age = {this.state.age} email = {this.state.email}/>
                {this.state.friends ? 
                    this.state.friends.map(friend => {
                        return <Friend key = {friend.id} data = {friend} delete = {this.handleDelete}/>
                    }) 
                    :
                    'loading'
                }
            </>
        )
    }
}

const FriendForm = (props) => {
    return (
        <form onSubmit = {props.write ? props.submit : props.update}>
            <input name = 'name' type = 'text' value = {props.name ? props.name : ''} onChange = {props.onChange}/>
            <input name = 'age' type = 'number' value = {props.age? props.age : ''} onChange = {props.onChange}/>
            <input name = 'email' type = 'text' value = {props.email? props.email : ''} onChange = {props.onChange}/>
            <input type = 'submit' value = {props.write ? 'add Frwend' : 'Update'}/>
        </form>
    )
}

class Friend extends Component {
    constructor(props){
        super(props)
        
        this.state = {
            isUpdating: false,
            name: this.props.data.name,
            age: this.props.data.age,
            email: this.props.data.email
        }
    }

    toggleIsUpdating = () => {
        this.setState({
            isUpdating: !this.state.isUpdating
        })
    }
    handleChange = e => {
        console.log(e.target.value)
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleSubmitUpdate = e => {
        e.preventDefault()
        axios.put(`http://localhost:5000/friends/${this.props.data.id}`, {
            name: this.state.name,
            age: this.state.age,
            email: this.state.email
        })
        this.toggleIsUpdating()
    }
    render(){
        return (
            <div>
                <h1>{this.state.name}</h1>
                <h3>{this.state.age}</h3>
                <h5>{this.state.email}</h5>
                <button onClick = {() => this.props.delete(this.props.data.id)}>delete</button>
                {!this.state.isUpdating ?
                    <button onClick ={() => this.toggleIsUpdating()}>update</button>
                    :
                    <div>
                        <FriendForm update = {this.handleSubmitUpdate} onChange = {this.handleChange} name = {this.state.name} age = {this.state.age} email = {this.state.email}/>
                    </div>

                }
            </div>
        )
    }
}