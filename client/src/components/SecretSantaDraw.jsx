import { useState } from "react";
import PropTypes from 'prop-types';

const SecretSantaDraw = ({ participants, identifiedParticipant, isOrganizer, groupCode }) => {
    const [pairs, setPairs] = useState(null);

    const circularPermutationWithCouples = () => {
        let shuffled;
        let valid = false;

        // Repeat shuffling until it respects the couples rule
        while (!valid) {
            shuffled = [...participants].sort(() => Math.random() - 0.5);
            valid = shuffled.every((participant, index) => {
                const next = shuffled[(index + 1) % shuffled.length];
                return participant.couple !== next.name; // Ensure the receiver is not the partner
            });
        }

        // Create pairs
        const results = shuffled.map((participant, index) => ({
            giver: participant.name,
            receiver: shuffled[(index + 1) % shuffled.length].name,
        }));

        setPairs(results);

        // Send the draw result to the server
        const drawResult = results.map(pair => `${pair.giver} offre un cadeau à ${pair.receiver}`);
        fetch('https://santapi.stevenbachimont.com/update-title', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title: groupCode, drawResult }),
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

    if (!pairs) {
        return <button onClick={circularPermutationWithCouples}>Faire le tirage</button>;
    }

    if (isOrganizer) {
        return (
            <div>
                <p>Group Code: {groupCode}</p>
                {pairs.map(pair => (
                    <p key={pair.giver}>{pair.giver} offre un cadeau à {pair.receiver}</p>
                ))}
            </div>
        );
    }

    const identifiedPair = pairs.find(pair => pair.giver === identifiedParticipant?.name);

    return (
        <div>
            {identifiedPair ? (
                <p>{identifiedPair.giver} offre un cadeau à {identifiedPair.receiver}</p>
            ) : (
                <p>Participant non trouvé</p>
            )}
        </div>
    );
};

SecretSantaDraw.propTypes = {
    participants: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        couple: PropTypes.string,
    })).isRequired,
    identifiedParticipant: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }),
    isOrganizer: PropTypes.bool.isRequired,
    groupCode: PropTypes.string,
};

export default SecretSantaDraw;
