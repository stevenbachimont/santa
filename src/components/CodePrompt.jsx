import { useState } from 'react';

const CodePrompt = ({ onCodeSubmit }) => {
    const [code, setCode] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onCodeSubmit(code);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Enter access code:
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
};

export default CodePrompt;
