# Example App for React Native Multiple Modals

## Setup

1. Install Node Modules `yarn install`
1. Install CocoaPods `pod install --project-directory=ios`
1. Run the app:
   1. Android: `yarn android`
   1. iOS: `yarn ios`

## Examples inside

1. **RegularModal** - the most simple use case.
1. **AnimatedModal** - same as regular, but with custom entering and exiting animations.
1. **BlockingModal** - different animation. Cannot be closed by tapping outside or android back button.
1. **BlurredModal** - same as blocking modal, but backdrop uses blur component
