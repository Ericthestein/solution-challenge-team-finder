import React, {useState} from "react";

import "./App.css";
import FirebaseDataAgent from "./data/FirebaseDataAgent";
import TeamFinder from "./components/TeamFinder/TeamFinder";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TeamFinderInstructions from "./components/TeamFinder/TeamFinderInstructions";

const App = () => {

    // dialog alerts
    const [showingDialog, setShowingDialog] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogDescription, setDialogDescription] = useState("");

    const showDialog = (config) => {
        const title = config.title;
        const description = config.description;

        setDialogTitle(title);
        setDialogDescription(description);
        setShowingDialog(true);
    }

    const onDialogClose = () => {
        setShowingDialog(false);
    }

    return (
        <div className="App">
            <div className={"Title"}>
                <h2><a href={"https://events.withgoogle.com/dsc-solution-challenge/"}>Solution Challenge</a> Team Finder</h2>
            </div>
            <Paper className={"TeamFinderInstructionsContainer"} elevation={10}>
                <TeamFinderInstructions />
            </Paper>
            <Paper className={"TeamFinderContainer"} elevation={10}>
                <TeamFinder
                    showDialog={showDialog}
                    dataAgent={new FirebaseDataAgent()}
                />
            </Paper>

            <Dialog
                open={showingDialog}
                onClose={onDialogClose}
            >
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogDescription}
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default App;
