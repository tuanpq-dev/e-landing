import { Input } from "antd";

const { TextArea } = Input;

type InputTextAreaProps = {
    fieldName: string;
    label: string;
    rows?: number;
    placeholder?: string;
}

function AntInputTextArea({
    fieldName,
    label,
    rows = 4,
    placeholder = `Nhập ${label.toLocaleLowerCase()}`,
}: InputTextAreaProps) {
    return (
        <div className="input-textarea">
            <label htmlFor={fieldName}>{label}</label>

            <TextArea
                id={fieldName}
                name={fieldName}
                rows={rows}
                placeholder={placeholder}
            />
        </div>
    );
}

export default AntInputTextArea;