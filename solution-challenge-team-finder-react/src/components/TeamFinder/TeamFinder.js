import React, {useState} from 'react';
import TeamFinderForm from "./TeamFinderForm";

/**
 *
 * @param props: dataAgent, showDialog (optional)
 * @returns {*}
 * @constructor
 */
const TeamFinder = (props) => {
    const [isFinding, setIsFinding] = useState(false);

    const onSubmit = (formData) => {
        if (isFinding) return;
        setIsFinding(true);
        props.dataAgent.startFindingTeam(formData).then(() => {
            props.showDialog && props.showDialog({
                title: "Successfully added to queue!",
                description: `Thank you for using Solution Challenge Team Finder, ${formData.name}! We'll send an email to
                    ${formData.email} once we group you up with others from
                    ${formData.school}. Best of luck!`
            });
        }).catch((err) => {
            if (err) {
                props.showDialog && props.showDialog({
                    title: "Error adding to queue",
                    description: err.toString()
                });
            } else {
                props.showDialog && props.showDialog({
                    title: "Error adding to queue",
                    description: `We've encountered an unexpected error while adding you to the queue. We'll look into it
                    soon. Sorry for the inconvenience!`
                });
            }
        }).finally(() => {
            setTimeout(() => {
                setIsFinding(false);
            }, 2000) // prevent spam
        })
    }

    return(
        <TeamFinderForm
            showLoading={isFinding}
            onSubmit={onSubmit}
        />
    )
}

export default TeamFinder;