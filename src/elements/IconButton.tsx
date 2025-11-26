import "./IconButton.css";

export function IconButton({ iconName, buttonValue, onClick }:
    { iconName: string, buttonValue: string, onClick: () => void }) {
    return <button type="button" class="IconButton" onClick={onClick}>
        <span class="material-symbols-outlined">{iconName}</span>
        {buttonValue}
    </button>
}