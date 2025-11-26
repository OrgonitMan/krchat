import { IconButton } from "./IconButton";
import { TextInput, TextInputProps } from "./TextInput";
import "./TextInputAndButton.css"

export type TextInputAndButtonProps = TextInputProps & {
    buttonContent?: string;
    onClick?: () => void;
}

export function TextInputAndButton({ buttonContent, onClick, ...textInputProps }:
    TextInputAndButtonProps) {
    return <div class="TextInputAndButton">
        <TextInput {...textInputProps} onEnter={onClick} />
        <IconButton iconName={buttonContent} buttonValue={buttonContent} onClick={onClick}/>
    </div>
}