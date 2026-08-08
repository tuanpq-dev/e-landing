import { Form, type FormItemProps, type InputProps } from "antd";
import AntInput from "./AntInput";

type FormInputProps = Omit<InputProps, "name"> & {
    label: string;
    fieldName: FormItemProps["name"];
    required?: boolean;
    rules?: FormItemProps["rules"];
};

function FormInput({
    fieldName,
    label,
    rules = [],
    ...attrs
}: FormInputProps) {
    const placeholder = `Nhập ${label.toLocaleLowerCase()}`
    return (
        <Form.Item name={fieldName} label={label} rules={rules}>
            <AntInput placeholder={placeholder} {...attrs} />
        </Form.Item>
    )
}

export default FormInput;