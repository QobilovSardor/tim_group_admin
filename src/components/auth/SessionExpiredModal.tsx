import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLoginAgain = () => {
    onClose();
    navigate(ROUTES.LOGIN);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired due to inactivity or token expiration. Please log in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-center">
          <Button type="button" variant="default" onClick={handleLoginAgain} className="bg-blue-600 hover:bg-blue-700">
            Log In Again
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SessionExpiredModal;
