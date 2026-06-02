import { TextField, type TextFieldProps } from '@mui/material';

export function FormField(props: TextFieldProps) {
  return <TextField fullWidth {...props} />;
}
