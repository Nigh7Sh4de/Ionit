# Ionit


### How to build for release
1. Clone repo
2. Create/add to `~/.gradle/gradle.properties` (keys must be acquired directly from repo owner):
```
MYAPP_RELEASE_STORE_FILE=release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=ionit-release-key
MYAPP_RELEASE_STORE_PASSWORD=
MYAPP_RELEASE_KEY_PASSWORD=
```
3. Generate keystore in `android/app`