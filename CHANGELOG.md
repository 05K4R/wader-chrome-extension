# Changelog
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## Unreleased
- Updated the icon to a fresh one, thanks @NangiDev!

## 0.5.2 - 2021-07-21
### Fixed
- Use correct Firebase project in package.

## 0.5.1 - 2021-07-19
### Fixed
- Remove unused identity permission.

## 0.5.0 - 2020-05-25
### Added
- Wader now loads on other SoundCloud paths in addition to /stream.
- Playlist posts and reposts are now also counted for profile scores.

### Changed
- Hides the reposter section if the track isn't reposted.
- Indicates profile score with colored name instead of text. Blue, black, and red is used for positive, neutral, and negative respectively.

## 0.4.2 - 2019-08-10
### Fixed
- Tracks that appear in the stream in other ways than reposts are now properly recognized.

## 0.4.1 - 2019-08-04
### Fixed
- Fixed extension hanging due to making too many requests to Firebase.

## 0.4.0 - 2019-08-03
### Added
- Profile ratings shown in the popup.

### Changed
- New UI design using Bulma instead of Bootstrap.
- Popup is now more responsive to track changes.
- Backend through Wader Functions instead of direct writes to Firebase.
- Reworked internal data model.

### Removed
- Custom category and label management.

## 0.3.0 - 2019-03-02
This release only contains internal updates.

## 0.2.0 - 2018-09-30
### Added
- This changelog!
- Popup indication when a user need to sign in.
- A horrible temporary extension icon!

## 0.1.0 - 2018-08-26
### Added
- Sign in using Google account.
- Add and delete categories and labels.
- See currently playing track in the popup.
- Set category and add/remove label for currently playing track.
- See category and label ratios for current reposter in the popup.
