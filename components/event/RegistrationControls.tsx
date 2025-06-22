import { Button } from '@/components/ui/button';

interface Props {
    canRegister: boolean;
    canUnregister: boolean;
    onRegister: () => void;
    onUnregister: () => void;
}

export default function RegistrationControls({ canRegister, canUnregister, onRegister, onUnregister }: Props) {
    if (canRegister) return <Button onClick={onRegister}>Register</Button>;
    if (canUnregister) return <Button onClick={onUnregister}>Leave</Button>;
    return null;
}