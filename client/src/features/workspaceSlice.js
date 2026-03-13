import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;
        },
        setCurrentWorkspace: (state, action) => {
            localStorage.setItem("currentWorkspaceId", action.payload);
            state.currentWorkspace = state.workspaces.find((w) => w.id === action.payload);
        },
        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);

            // set current workspace to the new workspace
            if (state.currentWorkspace?.id !== action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        updateWorkspace: (state, action) => {
            state.workspaces = state.workspaces.map((w) =>
                w.id === action.payload.id ? action.payload : w
            );

            // if current workspace is updated, set it to the updated workspace
            if (state.currentWorkspace?.id === action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        deleteWorkspace: (state, action) => {
            state.workspaces = state.workspaces.filter((w) => w._id !== action.payload);
        },
        addProject: (state, action) => {
            state.currentWorkspace.projects.push(action.payload);
            // find workspace by id and add project to it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? { ...w, projects: w.projects.concat(action.payload) } : w
            );
        },
        addTask: (state, action) => {

            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                console.log(p.id, action.payload.projectId, p.id === action.payload.projectId);
                if (p.id === action.payload.projectId) {
                    p.tasks.push(action.payload);
                }
                return p;
            });

            // find workspace and project by id and add task to it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? { ...p, tasks: p.tasks.concat(action.payload) } : p
                    )
                } : w
            );
        },
        updateTask: (state, action) => {
            state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    p.tasks = p.tasks.map((t) =>
                        t.id === action.payload.id ? action.payload : t
                    );
                }
            });
            // find workspace and project by id and update task in it
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? {
                            ...p, tasks: p.tasks.map((t) =>
                                t.id === action.payload.id ? action.payload : t
                            )
                        } : p
                    )
                } : w
            );
        },
        deleteTask: (state, action) => {
            state.currentWorkspace.projects.map((p) => {
                p.tasks = p.tasks.filter((t) => !action.payload.includes(t.id));
                return p;
            });
// find workspace and project by id and delete task from it

        inviteMemberWorkspace: (state, action) => {
            const { workspaceId, email, role } = action.payload;
            const pendingId = `pending_${Date.now()}`;
            const pendingMember = {
                id: pendingId,
                user: { 
                    email, 
                    name: 'Pending Invitation'
                },
                role,
                pending: true
            };
            // Update currentWorkspace
            if (state.currentWorkspace?.id === workspaceId) {
                state.currentWorkspace.members.push(pendingMember);
            }
            // Update workspaces array
            state.workspaces = state.workspaces.map((w) => 
                w.id === workspaceId 
                    ? { ...w, members: [...w.members, pendingMember] } 
                    : w
            );
        },

        addMemberToProject: (state, action) => {
            const { projectId, email } = action.payload;
            const newMember = {
                user: { email },
                role: 'member'
            };
            // Update currentWorkspace project
            if (state.currentWorkspace) {
                const project = state.currentWorkspace.projects.find(p => p.id === projectId);
                if (project) {
                    project.members.push(newMember);
                }
            }
            // Update workspaces array
            state.workspaces = state.workspaces.map((w) => 
                w.id === state.currentWorkspace?.id ? {
                    ...w,
                    projects: w.projects.map(p => 
                        p.id === projectId 
                            ? { ...p, members: [...p.members, newMember] }
                            : p
                    )
                } : w
            );
        }
            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id ? {
                    ...w, projects: w.projects.map((p) =>
                        p.id === action.payload.projectId ? {
                            ...p, tasks: p.tasks.filter((t) => !action.payload.includes(t.id))
                        } : p
                    )
                } : w
            );
        }

    }
});

export const { setWorkspaces, setCurrentWorkspace, addWorkspace, updateWorkspace, deleteWorkspace, addProject, addTask, updateTask, deleteTask, inviteMemberWorkspace, addMemberToProject } = workspaceSlice.actions;
export default workspaceSlice.reducer;

