import { useState } from "react";
import { X, Check } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addWorkspace } from "../features/workspaceSlice";
import toast from "react-hot-toast";

const CreateWorkspaceDialog = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const newWorkspace = {
                id: `ws_${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`, // Simple ID gen without uuid
                name: formData.name,
                slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
                description: "",
                settings: {},
                ownerId: "user_current", // Real user ID from auth
                createdAt: new Date().toISOString(),
                image_url: "", // Default from assets
                updatedAt: new Date().toISOString(),
                members: [],
                projects: [],
                owner: { id: "user_current", name: "You", image: "" }
            };

            dispatch(addWorkspace(newWorkspace));
            toast.success("Workspace created!");
            onClose();
            setFormData({ name: "", slug: "" });
        } catch (error) {
            toast.error("Failed to create workspace");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl p-6 w-full max-w-md mx-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Workspace</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-zinc-800 rounded-lg">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-zinc-300">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                                });
                            }}
                            placeholder="My Team Workspace"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-zinc-300">Slug (URL)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            placeholder="my-team"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-zinc-300 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.name.trim()}
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            {isSubmitting ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateWorkspaceDialog;

