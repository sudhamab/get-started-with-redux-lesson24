import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import todoApp from './reducers'

const store = createStore(todoApp);
 
const Link = ({
  active,
  children,
  onClick
}) => {
  if(active) {
    return <span>{children}</span>;
  }
  return (
    <a href='#'
      onClick={e => {
        e.preventDefault();
        onClick();
      }}
    >
    {children}
    </a>
  )
}

class FilterLink extends Component {

  /*
  ** unless you subscribe to it, the 
  ** store.getState() will get stale 
  ** values when the component re-renders.
  ** store.subscribe() returns a reference to store.unsubscribe()
  ** hence we can save this reference so that it can be called in the 
  ** componentWillUnmount() function later when the component unmounts
  *
  */

  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    /* get store state, not react state */
    const state = store.getState(); 

    return (
      <Link
        active = {
          props.filter 
            === state.visibilityFilter
        }
        onClick={() =>
          store.dispatch({
            type: 'SET_VISIBILITY_FILTER',
            filter: props.filter
          })
        }
        >
          {props.children}
        </Link> 
    );
  }
}

/* Converted from a function that passes down props 
** to only presentational.
*/
const Footer = () => (
  <p>
    Show:
    {' '}
    <FilterLink
      filter='SHOW_ALL'
    >
    All 
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_ACTIVE'
    >
    Active
    </FilterLink>
    {' '}
    <FilterLink
      filter='SHOW_COMPLETED'
    >
    Completed
    </FilterLink>
  </p>

)


/*
** Todo - PRESENTATIONAL COMPONENT Todo using 
** "stateless functional component syntax"
** One of the things to be done is to seprate out the 
** presentationl and the Behavioral components. 
** Functionl components can be defined even for the 
** presentational stuff which actually don't have any behavior 
** hence the name functional may sound confusing but 
** read this article 
** https://facebook.github.io/react/blog/2015/10/07/react-v0.14.html#stateless-functional-components
*/ 

const Todo = ({
  onClick,
  completed,
  text
}) => (

  <li 
    onClick={onClick} 
      style={{ 
        textDecoration:
          completed ?
            'line-through':
            'none'
      }}>
    {text}
  </li>
);


/*
** Note that VisibleTodoList is not a functional 
** component because functional components do not 
** have access to the lifeCycle methods that 
** React Components have. 
*/ 
class VisibleTodoList extends Component {

  componentDidMount() {
    this.unsubscribe = store.subscribe(() =>
      this.forceUpdate()
    );
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const props = this.props;
    const state = store.getState();

    return (
      <TodoList 
        todos={
          getVisibleTodos(
            state.todos,
            state.visibilityFilter
          )
        }
        onTodoClick={id=>
          store.dispatch({
            type: 'TOGGLE_TODO',
            id 
          })
        }
      />  
    )
  }
}

/*
** TodoList - PRESENTATIONAL COMPONENT Todo using 
** "stateless functional component syntax" 
** Dan wants to keep the TodoList a presentational component
** but wants to encapsulate reading the currently visible
** todos into a separate container component that connects the todo list 
** to the redux store. This component will be the VisibleTodoList 
*/

const TodoList = ({
  todos,
  onTodoClick
}) => (
  <ul>
    {
      todos.map(todo => 
        <Todo 
          key={todo.id}
          {...todo}
          onClick={() => onTodoClick(todo.id)}
        />
    )}
  </ul>
);


/*
** Dan backtracked a little from 
** passing in the onClick handler 
** and put back the code to call the dispatcher from this 
** function itself because there isn't a lot of presentation 
** or behavior here. It's easier to keep them together 
** until you can figure out how to split the behavior and presentation 
** For example, if this was a form component, then you would 
** write it the way it was earlier. 
*/
const AddTodo = () => {
  let input;
  return(
    <div>
      <input ref={node => {
            input = node;
          }} />
      <button onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: input.value
          })
        input.value = '';
      }}>
      Add Todo 
      </button>
    </div>
  );
};

/*
** NOTE: the following is just a utility function, 
** versus a functional component such as FilterLink
** I am stating the obvious here but this is so 
** as to just bring your attention to the little details 
** because with similarities in syntax, the difference 
** in purpose is sometimes not obvious.
*/

const getVisibleTodos = (
  todos, 
  filter
  ) => {
    switch (filter) {
      case 'SHOW_ALL':
        return todos;
      case 'SHOW_COMPLETED':
        return todos.filter( t => t.completed);
      case 'SHOW_ACTIVE':
        return todos.filter( t => !t.completed);
      default:
        return todos;
    }
}



 
let nextTodoId = 0;

/*
** After all the simplification, the TodoApp component which was the 
** main component has now become much simpler. 
*/ 
const TodoApp = () => (
  <div>
    <AddTodo />
    <VisibleTodoList />
    <Footer />
  </div>
);

/*
** Now here is the good part. 
** since the components that need to track the store state 
** subscribe to them individually, we don not need to worry 
** about passing it in through the render method. 
** we just call ReactDOM.render() once and then leave it 
** to the subscribed components to update themselves when 
** the store state changes.. 
*/ 
ReactDOM.render(
  <TodoApp />,
  document.getElementById('root')
);

