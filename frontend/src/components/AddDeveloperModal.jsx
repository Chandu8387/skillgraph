import { useState } from "react";

import {
    createDeveloper
} from "../services/api";


function AddDeveloperModal({
    onClose,
    onCreated
}) {

    const [form, setForm] = useState({
        name: "",
        role: "",
        email: "",
        location: "",
        experience: "",
        bio: "",
        skills: "",
        projects: "",
    });


    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");


    function handleChange(event) {

        const {
            name,
            value
        } = event.target;

        setForm(prev => ({
            ...prev,
            [name]: value,
        }));
    }


    async function handleSubmit(event) {

        event.preventDefault();

        setError("");


        if (!form.name.trim()) {

            setError(
                "Developer name is required."
            );

            return;
        }


        if (!form.role.trim()) {

            setError(
                "Developer role is required."
            );

            return;
        }


        try {

            setSaving(true);


            const developer = {

                name:
                    form.name.trim(),

                role:
                    form.role.trim(),

                email:
                    form.email.trim(),

                location:
                    form.location.trim(),

                experience:
                    form.experience.trim(),

                bio:
                    form.bio.trim(),

                skills:
                    form.skills
                        .split(",")
                        .map(
                            skill =>
                                skill.trim()
                        )
                        .filter(Boolean),

                projects:
                    form.projects
                        .split(",")
                        .map(
                            project =>
                                project.trim()
                        )
                        .filter(Boolean),
            };


            console.log(
                "POST /api/developers:",
                developer
            );


            const created =
                await createDeveloper(
                    developer
                );


            console.log(
                "CREATED:",
                created
            );


            if (onCreated) {

                await onCreated(
                    created
                );
            }


            onClose();


        } catch (err) {

            console.error(
                "Create developer failed:",
                err
            );

            setError(
                err.message ||
                "Unable to create developer."
            );

        } finally {

            setSaving(false);
        }
    }


    return (

        <div
            className="modal-backdrop"
            onClick={onClose}
        >

            <div
                className="developer-modal"
                onClick={
                    event =>
                        event.stopPropagation()
                }
            >

                <div className="modal-header">

                    <div>

                        <span className="modal-eyebrow">
                            DEVELOPER
                        </span>

                        <h2>
                            Add new developer
                        </h2>

                        <p>
                            Create a developer profile
                            and connect skills and projects.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-grid">

                        <div className="form-field">

                            <label>
                                Name *
                            </label>

                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Rahul"
                                disabled={saving}
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Role *
                            </label>

                            <input
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                placeholder="e.g. Full Stack Developer"
                                disabled={saving}
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="rahul@example.com"
                                disabled={saving}
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Location
                            </label>

                            <input
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Bangalore, India"
                                disabled={saving}
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Experience
                            </label>

                            <input
                                name="experience"
                                value={form.experience}
                                onChange={handleChange}
                                placeholder="5+ Years"
                                disabled={saving}
                            />

                        </div>


                        <div className="form-field">

                            <label>
                                Skills
                            </label>

                            <input
                                name="skills"
                                value={form.skills}
                                onChange={handleChange}
                                placeholder="Python, React, SQL"
                                disabled={saving}
                            />

                            <small>
                                Separate skills with commas
                            </small>

                        </div>


                        <div className="form-field form-full">

                            <label>
                                Projects
                            </label>

                            <input
                                name="projects"
                                value={form.projects}
                                onChange={handleChange}
                                placeholder="Food Ordering, E-Learning Platform"
                                disabled={saving}
                            />

                            <small>
                                Separate projects with commas
                            </small>

                        </div>


                        <div className="form-field form-full">

                            <label>
                                About
                            </label>

                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                placeholder="Short developer description..."
                                rows={4}
                                disabled={saving}
                            />

                        </div>

                    </div>


                    {error && (

                        <div className="form-error">
                            {error}
                        </div>

                    )}


                    <div className="modal-actions">

                        <button
                            type="button"
                            className="button-secondary"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="button-primary"
                            disabled={saving}
                        >

                            {saving
                                ? "Creating..."
                                : "Create developer"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


export default AddDeveloperModal;