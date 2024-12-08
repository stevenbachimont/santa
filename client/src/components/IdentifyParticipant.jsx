import { useState } from 'react';

const IdentifyParticipant = ({ participants, onIdentify }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const participant = participants.find(p => p.name === name);
        if (participant) {
            onIdentify(participant);
        } else {
            alert('Participant not found');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter your name:
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default IdentifyParticipant;
