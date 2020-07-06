import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import Diff from './components/dom-diff';
import LifeBefore from './components/lifeCircle-before';
import LifeAfter from './components/lifeCircle-after';
import InputHoc from './components/Hoc';
import HooksState from './components/Hooks/state';
import HooksReducer from './components/Hooks/reducer';
import HooksContext from './components/Hooks/Context/index';
import MemoComp from './components/Hooks/memo';
import './App.css';

const InputEmail = props => <input type="email" {...props.fields('email')}/>;

const HocInputEmail = InputHoc(InputEmail);

function App() {
  const fields = {
    fieldName: 'email',
    email: 'luffyzh@163.com'
  }
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <div className='nav-bar'>
            <nav>
              <Link to="/dom-diff">Dom Diff</Link>
              <Link to="/life-before">Life Before</Link>
              <Link to="/life-after">Life After</Link>
              <Link to="/hooks-state">Hooks State</Link>
              <Link to="/hooks-reducer">Hooks Reducer</Link>
              <Link to="/hooks-context">Hooks Context</Link>
              <Link to="/memo">Memo</Link>
            </nav>
          </div>
          <div style={{ paddingTop: 60 }}>
            <Switch>
              <Route path="/dom-diff">
                <Diff />
              </Route>
              <Route path="/life-before">
                <LifeBefore />
              </Route>
              <Route path="/life-after">
                <LifeAfter />
              </Route>
              <Route path="/hooks-state">
                <HooksState />
              </Route>
              <Route path="/hooks-reducer">
                <HooksReducer />
              </Route>
              <Route path="/hooks-context">
                <HooksContext />
              </Route>
              <Route path="/memo">
                <MemoComp />
              </Route>
            </Switch>
          </div>
        </Router>
        <HocInputEmail fields={fields} />
      </header>
    </div>
  );
}

export default App;
