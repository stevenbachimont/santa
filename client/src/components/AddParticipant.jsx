import { useState } from "react";

const AddParticipant = ({ onAdd }) => {
    const [name, setName] = useState("");
    const [couple, setCouple] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            onAdd({ name: name.trim(), couple: couple.trim() || null });
            setName("");
            setCouple("");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Nom du participant"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Nom du partenaire (optionnel)"
                value={couple}
                onChange={(e) => setCouple(e.target.value)}
            />
            <button type="submit">Ajouter</button>
        </form>
    );
};

export default AddParticipant;
