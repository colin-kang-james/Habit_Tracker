import { useState, useEffect } from 'react';

export default function App() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');

  useEffect(() => {
    fetch('/api/habits')
      .then(res => res.json())
      .then(setHabits);
  }, []);

  function toggleHabit(id) {
    fetch(`/api/habits/${id}/toggle`, { method: 'POST' })
      .then(() => fetch('/api/habits'))
      .then(res => res.json())
      .then(setHabits);
  }

  function deleteHabit(id) {
    fetch(`/api/habits/${id}`, { method: 'DELETE' })
      .then(() => setHabits(habits.filter(h => h.id !== id)));
  }

  function addHabit(e) {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    fetch('/api/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newHabitName }),
    })
      .then(res => res.json())
      .then(habit => {
        setHabits([...habits, habit]);
        setNewHabitName('');
      });
  }

  return (
    <div>
      <h1>My Habits</h1>

      <form onSubmit={addHabit}>
        <input
          type="text"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="New habit name"
        />
        <button type="submit" style={{ background: 'blue', color: 'white', padding: '8px' }}>Add</button>
      </form>

      <ul>
        {habits.map(habit => (
          <li key={habit.id}>
            <label>
              <input
                type="checkbox"
                checked={habit.done}
                onChange={() => toggleHabit(habit.id)}
              />
              {habit.name}
            </label>
            <button onClick={() => deleteHabit(habit.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}