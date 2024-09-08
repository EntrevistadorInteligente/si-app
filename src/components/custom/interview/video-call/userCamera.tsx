import { forwardRef } from 'react'
import { RefreshCcw } from 'lucide-react'

type UserCameraProps = {
  cameraError: string | null;
  onClick: () => void;
  isLookingToCamera: boolean;
}

const UserCamera = forwardRef<HTMLVideoElement, UserCameraProps>((props, ref) => {
  return <div className="absolute top-4 left-4 z-10 md:w-1/4 w-1/3">
    {props.cameraError ? (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Camera Error:</strong>
        <span className="block sm:inline"> {props.cameraError}</span>
        <button
          className="absolute top-0 right-0 px-4 py-3"
          onClick={props.onClick}
        >
          <RefreshCcw className="h-5 w-5 text-red-500" />
        </button>
      </div>
    ) : (
      <div className={props.isLookingToCamera ? '' : 'border-2 border-red-500'}>
        <video
          ref={ref}
          className="w-full rounded-lg"
          autoPlay
          playsInline
          muted
        />
      </div>
    )}
  </div>
});

UserCamera.displayName = 'UserCamera'

export default UserCamera;