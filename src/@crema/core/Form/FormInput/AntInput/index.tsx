import { Input, type InputProps } from "antd";

type AntInputProps = InputProps;

function AntInput(props: AntInputProps) {
    return <Input {...props} />
}

export default AntInput;