require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);
const User = require("./models/user.modal")
const Note = require("./models/note.modal");

const express = require("express");
const cors = require("cors");
const app = express();

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin: '*',
    })
);

app.get("/", (req, res) => {
    res.json({ data: "Hello" });
});

//backend Ready !!!

//create an account 
app.post("/create-account", async (req, res) => {
    try {
        const { fullName, email, password } = req.body || {};

        if (!fullName) {
            return res.status(400).json({
                error: true,
                message: "Name is required"
            });
        }

        if (!email) {
            return res.status(400).json({
                error: true,
                message: "Email is required"
            });
        }

        if (!password) {
            return res.status(400).json({
                error: true,
                message: "Password is required"
            });
        }


        const isUser = await User.findOne({ email: email });

        if (isUser) {
            return res.status(400).json({
                error: true,
                message: "User already exists"
            });
        }

        const user = new User({
            fullName,
            email,
            password,
        });

        await user.save();
        const accessToken = jwt.sign({ _id: user._id, email: user.email }, process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "36000m" }
        );
        return res.json({
            error: false,
            user,
            accessToken,
            message: "Registration Successful"
        });
    }
    catch (error) {
        console.error("Error in /create-account:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }

});
//Login account
app.post("/login", async (req, res) => {
    const { email, password } = req.body || {};

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    if (!password) {
        return res.status(400).json({
            message: "password is required"
        });
    }

    const userInfo = await User.findOne({ email: email });

    if (!userInfo) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    if (userInfo.email == email && userInfo.password == password) {
        const user = { user: userInfo };
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "36000m",

            });


        return res.json({
            error: false,
            message: "Login Successfull",
            email,
            accessToken,
        });
    } else {
        return res.status(400).json({
            error: true,
            message: "Invalid Credentials",
        });
    }
});

//Get user
app.get("/get-user", authenticateToken, async (req, res) => {
    const { user } = req.user;
    console.log("getuser", user);
    const isUser = await User.findOne({ _id: user.user._id });
    console.log("isUser", isUser);
    console.log("isUserId",isUser._id);

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: {
            fullName: isUser.fullName,
            email: isUser.email,
            _id: isUser._id,
            createdOn: isUser.createdOn
        },
        message: "",
    })
});

//add note
app.post("/add-note", authenticateToken, async (req, res) => {
    const { title, content, tags } = req.body || {};
    const { user } = req.user;
    console.log("addnote-userid",user.user._id);

    if (!title) {
        return res.status(400).json({
            error: true,
            message: "Title is required"
        })
    }
    if (!content) {
        return res.status(400).json({
            error: true,
            message: "Content is required"
        })
    }
    
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user.user._id,
        });

        await note.save();
        console.log("noteaftersavingwith ID",note)
        return res.json({
            error: false,
            note,
            message: "Note added successfully"
        })
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

//edit note
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tags, isPinned } = req.body || {};
    const { user } = req.user;
    console.log(user);

    if (!title && !content && !tags) {
        return res.status(400).json({
            error: true,
            message: "No changes provided"
        })
    }

    try {
        const note = await Note.findOne({ _id: noteId, userId: user.user._id });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }

        if (title) note.title = title;
        if (content) note.content = content;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;


        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note Updated Successfully"
        })
    }
    catch (error) {

        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});

//get all notes
app.get("/get-all-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;

    try {
        const notes = await Note.find({ userId: user.user._id }).sort({ isPinned: -1 });//-1 to print in descending order  1 ascending
        console.log(notes);
        return res.json({
            error: false,
            notes,
            message: "All notes retrieved successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.delete("/delete-notes/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    console.log("noteId", noteId);
    const { user } = req.user;
    console.log("user", user);
    console.log("user_is",user.user._id);

    try {
        const note = await Note.findOne({ _id: noteId, userId: user.user._id });
        console.log("note", note);

        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not Found",
            });
        }

        await Note.deleteOne({ _id: noteId, userId: user.user._id });

        return res.json({
            error: false,
            message: "Note deleted Successfully"
        });
    }
    catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        })
    }

})
//update isPinned Value
app.put("/update-notes-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body || {};
    const { user } = req.user;


    try {
        const note = await Note.findOne({ _id: noteId, userId: user.user._id });
        if (!note) {
            return res.status(404).json({
                error: true,
                message: "Note not found"
            })
        }

        note.isPinned = isPinned || false;
        await note.save();

        return res.json({
            error: false,
            note,
            message: "Note isPinned  Successfully"
        })
    }
    catch (error) {

        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
})
//Search notes
app.get("/search-notes/",authenticateToken,async(req,res)=>{
    const {user} = req.user;
    const {query} = req.query;

    if(!query){
        return res.status(400).json({
            error:true,
            message:"Search query is required"
        });
    }

    try{
        const matchingNotes = await Note.find({
            userId:user.user._id,
            $or:[
                {title : {$regex:new RegExp(query,"i")}},
                {content:{$regex:new RegExp(query,"i")}},
            ],
        });

        return res.json({
            error:false,
            notes:matchingNotes,
            message:" Notes matching the search query retrieved successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            error:true,
            message:"Internal Server Error",
        })
    }
});

app.listen(5000, () => console.log("App is running in port 5000"))

module.exports = app;