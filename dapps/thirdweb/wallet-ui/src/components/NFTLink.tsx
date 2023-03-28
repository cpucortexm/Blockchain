import { useLocation, useParams } from "react-router-dom";

export const NFTLink = () => {
    const { index  } = useParams<{index:string}>();
    const location = useLocation();
    const metadata = location.state?.metadata;

    if (!index || !metadata) {
        return <div>Loading...</div>;
    }
    const indexNumber = parseInt(index, 10);
    if (isNaN(indexNumber) || indexNumber < 0 || indexNumber >= metadata.length) {
        return <div>Invalid index</div>;
    }

    return (
        <div style={{ marginLeft: '80px' }}>
        {metadata[indexNumber]}
        </div>
    );
}