import NoteCard from "@/components/cards/noteCard";
import Navbar from "@/components/navbar/navbar";
import { Fragment, useEffect, useState } from "react"
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./addEditNotes";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInstance";
import Toast from "@/components/toastMessage/toast";
import EmptyCard from "@/components/emptyCard/empty-card";
import AddNotesImg from "../../assets/images/add-notes.svg";
import NoData from "../../assets/images/no-data.svg";


const Home = () => {

    const [openAddEditModal, setOpenAddEditModal] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    const [shownToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add"
    });

    const [userInfo, setUserInfo] = useState(null);
    const [allNotes, setAllNotes] = useState([]);

    const [isSearch, setIsSearch] = useState(false);

    const navigate = useNavigate();

    //handleEdit
    const handleEdit = (noteDetails) => {
        setOpenAddEditModal({
            isShown: true,
            data: noteDetails,
            type: "edit"
        });

    }
    //showToastmessage
    const showToastMessage = (message, type) => {
        setShowToastMsg({
            isShown: true,
            message,
            type,
        });
    };
    //handleToast
    const handleCloseToast = () => {
        setShowToastMsg({
            isShown: false,
            message: "",
        });
    };
    //get user info
    const getuserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        }
        catch (error) {
            if (error.response.status == 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };
    //get all notes
    const getAllNotes = async () => {
        try {
            const response = await axiosInstance.get("/get-all-notes");
            if (response.data && response.data.notes) {
                setAllNotes(response.data.notes);
            }
        }
        catch (error) {
            console.log("An unexpected error occured . Please try again");
        }
    }
    //delete note
    const deleteNote = async (data) => {
        const noteId = data._id;
        try {
            const response = await axiosInstance.delete("/delete-notes/" + noteId);
            if (response.data && !response.data.error) {
                showToastMessage("Note deleted Successfully", 'delete')
                getAllNotes()
                onClose()
            }
        }
        catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.log("An unexpected error occured . Please try again");
            }
        }
    }
    //search for a note
    const onSearchNote = async (query) => {
        try {
            const response = await axiosInstance.get("/search-notes", {
                params: { query },
            });

            if (response.data && response.data.notes) {
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        }
        catch (error) {
            console.log(error.message)
        }
    }
    //handle Search
    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }
    //handle isPinned
    const updateIsPinned = async (noteData) =>{
        const noteId = noteData._id
        try {
            const response = await axiosInstance.put("/update-notes-pinned/" + noteId, {
               "isPinned" : ! noteData.isPinned,
            });
            if (response.data && response.data.note) {
                showToastMessage(noteData.isPinned?  "Note Unpinned Succesfully":"Note Pinned  Successfully" )
                getAllNotes()
                onClose()
            }
        }
        catch (error) {
            console.log(error.message);
        }
    }


    useEffect(() => {
        getAllNotes();
        getuserInfo();
        return () => {

        }
    }, []);

    return (
        <Fragment>
            <Navbar userInfo={userInfo} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch} updateIsPinned={updateIsPinned}/>

            <div className="container mx-auto">
                {allNotes.length > 0 ? <div className="grid grid-cols-3 gap-7 mt-10">
                    {
                        allNotes.map((item, index) => (
                            <NoteCard
                                key={item._id}
                                title={item.title}
                                date={item.createdOn}
                                content={item.content}
                                tags={item.tags}
                                isPinned={item.isPinned}
                                onEdit={() => handleEdit(item)}
                                onDelete={() => deleteNote(item)}
                                onPinNote={() => {updateIsPinned(item) }}
                            />

                        ))
                    }

                </div> : <EmptyCard
                    imgSrc={isSearch? NoData : AddNotesImg}
                    message={isSearch?`Oops! No notes found matching your search.`:`Start creating your first note! Click the 'Add' Button to jot down your thoughts, ideas, and reminders.Let's get started!`} />}
            </div>

            <button 
                className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
                onClick={() => {
                    setOpenAddEditModal({
                        type: "add",
                        isShown: true,
                        data: null
                    })
                }}>
                <MdAdd className="text-[32px] text-white" />
            </button>

            <Modal
                isOpen={openAddEditModal.isShown}
                onRequestClose={() => { }}
                style={{
                    overlay: {
                        backgroundColor: "rgba(0,0,0,0.2",
                    },
                }}
                contentLabel=""
                className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-25 p-5 overflow-scroll"
            >
                <AddEditNotes
                    type={openAddEditModal.type}
                    noteData={openAddEditModal.data}
                    openAddEditModal={openAddEditModal}
                    setOpenAddEditModal={setOpenAddEditModal}
                    getAllNotes={getAllNotes}
                    showToastMessage={showToastMessage} />
            </Modal>

            <Toast
                isShown={shownToastMsg.isShown}
                message={shownToastMsg.message}
                type={shownToastMsg.type}
                onClose={handleCloseToast}
            />

        </Fragment>
    )
}

export default Home;