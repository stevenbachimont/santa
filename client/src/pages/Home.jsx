import { useState, useEffect } from "react";
import AddParticipant from "../components/AddParticipant.jsx";
import ParticipantsList from "../components/ParticipantsList.jsx";
import SecretSantaDraw from "../components/SecretSantaDraw.jsx";
import CodePrompt from "../components/CodePrompt.jsx";
import IdentifyParticipant from "../components/IdentifyParticipant.jsx";
import "./styles/Home.css";

const Home = () => {
    const [participants, setParticipants] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOrganizer, setIsOrganizer] = useState(false);
    const [identifiedParticipant, setIdentifiedParticipant] = useState(null);
    const [generatedCode, setGeneratedCode] = useState('');
    const organizerCode = '4321'; // Replace with your desired organizer code

    useEffect(() => {
        if (isAuthenticated) {
            fetch('http://localhost:5001/participants')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    // Ensure participants is an array
                    const participantsArray = Array.isArray(data.participants) ? data.participants : [];
                    setParticipants(participantsArray);
                })
                .catch(error => {
                    console.error('There was a problem with the fetch operation:', error);
                    setParticipants([]); // Set participants to an empty array in case of error
                });
        }
    }, [isAuthenticated]);

    const addParticipant = (participant) => {
        // Ensure participants is an array
        const participantsArray = Array.isArray(participants) ? participants : [];

        // Check if the participant's name already exists
        if (participantsArray.some(p => p.name === participant.name)) {
            setErrorMessage(`Participant with name ${participant.name} already exists`);
            return;
        }

        fetch(`http://localhost:5001/participants/${generatedCode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(participant),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(newParticipant => {
                setParticipants([...participantsArray, newParticipant]);
                setErrorMessage(''); // Clear error message on successful addition
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    const removeParticipant = (name) => {
        fetch(`http://localhost:5001/participants/${generatedCode}/${name}`, {
            method: 'DELETE',
        })
            .then(() => {
                setParticipants(participants.filter((p) => p.name !== name));
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    const handleCodeSubmit = (code) => {
        fetch(`http://localhost:5001/participants`)
            .then(response => response.json())
            .then(data => {
                if (data.title === code) {
                    setIsAuthenticated(true);
                    setGeneratedCode(code);
                } else if (code === organizerCode) {
                    setIsAuthenticated(true);
                    setIsOrganizer(true);
                } else {
                    alert('Incorrect code');
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    const handleIdentify = (participant) => {
        setIdentifiedParticipant(participant);
    };

    const handleGenerateCode = () => {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGeneratedCode(newCode);

        // Simulate the draw result
        const drawResult = participants.map((participant, index) => {
            const assignedTo = participants[(index + 1) % participants.length].name;
            return `${participant.name} offre un cadeau à ${assignedTo}`;
        });

        // Update the title and save the draw result
        fetch('http://localhost:5001/update-title', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: newCode, drawResult }),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    if (!isAuthenticated) {
        return <CodePrompt onCodeSubmit={handleCodeSubmit} />;
    }

    if (!identifiedParticipant && !isOrganizer) {
        return <IdentifyParticipant participants={participants} onIdentify={handleIdentify} />;
    }

    return (
        <div className="container">
            <h1>Secret Santa</h1>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {isOrganizer && (
                <div>
                    <button className="button" onClick={handleGenerateCode}>Generate Access Code</button>
                    {generatedCode && <p>Generated Code: {generatedCode}</p>}
                </div>
            )}
            <AddParticipant onAdd={addParticipant} />
            <ParticipantsList participants={participants} onRemove={removeParticipant} isOrganizer={isOrganizer} />
            {participants.length > 1 && <SecretSantaDraw participants={participants} identifiedParticipant={identifiedParticipant} isOrganizer={isOrganizer} />}
        </div>
    );
};

export default Home;
