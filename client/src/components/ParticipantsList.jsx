import PropTypes from 'prop-types';

const ParticipantsList = ({ participants, onRemove, isOrganizer }) => {
    const handleRemove = (name) => {
        fetch(`https://santapi.stevenbachimont.com/participants/${name}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (response.ok) {
                    onRemove(name);
                } else {
                    console.error('Failed to remove participant');
                }
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    return (
        <ul>
            {participants.map(participant => (
                <li key={participant.name}>
                    {participant.name}
                    {isOrganizer && <button onClick={() => handleRemove(participant.name)}>Remove</button>}
                </li>
            ))}
        </ul>
    );
};

ParticipantsList.propTypes = {
    participants: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
    })).isRequired,
    onRemove: PropTypes.func.isRequired,
    isOrganizer: PropTypes.bool.isRequired,
};

export default ParticipantsList;
