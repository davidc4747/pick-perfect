import { Link } from "react-router-dom";
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
            <Link to="/">Home</Link>
            <h1>Settings Page!</h1>
        </>
    );
}
