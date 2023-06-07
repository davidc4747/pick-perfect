// import { settings } from "./settings.module.css";

/* ===================== *\
    # Settings
\* ===================== */

interface PropTypes {
    value?: string;
}

export default function Settings(props: PropTypes): React.ReactElement {
    const { value } = props;

    return (
        <>
            <button
                onClick={() =>
                    dispatch({
                        type: AppActionType.ChangePage,
                        page: Page.ViewUserSelections,
                    })
                }
            >
                Home
            </button>
            <h1>Settings Page!</h1>
        </>
    );
}
