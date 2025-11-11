import TagInput from "@/components/input/taginput";
import axiosInstance from "@/utils/axiosInstance";
import { useState } from "react";
import { MdClose } from "react-icons/md";



const AddEditNotes = ({ setOpenAddEditModal, noteData, type, getAllNotes, showToastMessage }) => {

    const [title, setTitle] = useState(noteData?.title || "");
    const [content, setContent] = useState(noteData?.content || "");
    const [tags, setTags] = useState(noteData?.tags || "");

    const [error, setError] = useState(null);

    //AddNewNote
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags,
            });
            if (response.data && response.data.note) {
                showToastMessage("Note Added Successfully")
                getAllNotes()
                onClose()
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    }
    //Edit Note
    const EditNote = async () => {
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags,
            });
            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully")
                getAllNotes()
                onClose()
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        }
    }
    //handleAddNote
    const handleAddNote = () => {
        if (!title) {
            setError("Please enter the title.")
            return;
        }
        if (!content) {
            setError("Please enter the content.")
            return;
        }


        setError("");

        if (type === 'edit') {
            EditNote()
        } else {
            addNewNote()
        }
    }
    //onClose
    const onClose = () => {
        setOpenAddEditModal({
            isShown: false,
            type: "add",
            data: null,
        })
    }
    //ispinned or not
   

    return (
        <div className="relative">
            <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}   >
                <MdClose className=" cursor-pointer text-slate-400" />
            </button>
            <div className="flex flex-col gap-2">
                <label className="input-label">TITLE</label>
                <input
                    type="text"
                    className="text-2xl text-slate-950 outline-0"
                    placeholder="Go to Gym at night"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4">
                <label className="input-label">CONTENT</label>
                <textarea
                    type="text"
                    className="text-sm text-slate-950 outline-0 bg-slate-50 p-2 rounded"
                    placeholder="content"
                    rows={10}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>


            <div className="mt-3">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            <button
                className="btn-primary font-medium mt-5 p-3"
                onClick={handleAddNote}>{type === 'edit' ? 'UPDATE' : "ADD"}</button>

        </div>
    )
}

export default AddEditNotes;