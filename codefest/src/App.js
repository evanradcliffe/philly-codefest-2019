import React from 'react';
import './App.css';
import MyMap from './components/MyMap';
import Slider from './components/Slider';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div>
          <Slider/>
          <MyMap/>
        </div>
      </header>
    </div>
  );
}

export default App;
