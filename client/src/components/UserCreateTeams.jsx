import React, { useState } from 'react'

const UserCreateTeams = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [rows, setRows] = useState([]);

    const handleAddRow = () => {
        if (name && email) {
            setRows([...rows, {name, email}]);
            setName('');
            setEmail('');
        }
    };

    const handleDeleteRow = (index) => {
        const updatedRows = rows.filter((row, i) => i !== index);
        setRows(updatedRows);
      };

  return (
    <div className="user-create-teams">
    <label htmlFor="team-name" className="team-name-label">Team Name</label>
    <input 
        id="team-name"
        aria-label="Team Name"
        className="team-name-input"
    />
    <table className="teams-table">
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>

            </tr>
        </thead>
        <tbody>
            {Array.isArray(rows) && rows.map((row, index) => (
                <tr key={index}>
                    <td>{row.name}</td>
                    <td>{row.email}</td>
                    <td>
                        <button 
                            className="delete-button" 
                            onClick={() => handleDeleteRow(index)}
                        >
                            X
                        </button>
                    </td>
                </tr>
            ))}
            <tr>
                <td>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name"
                        className="input-field"
                    />
                </td>
                <td>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="input-field"
                    />
                </td>
                <td>
                    <button 
                        className="add-button"
                        onClick={handleAddRow}
                    >
                        Add
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    <button className="create-team-button">Create Team</button>
</div>
);
};



export default UserCreateTeams;