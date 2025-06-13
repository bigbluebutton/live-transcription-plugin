



# Repository of a plugin for BigBlueButton

## Description

https://github.com/user-attachments/assets/c1df2c62-9a9a-4827-ac07-f229c7130713

This plugin provides a panel to the client where the live transcription is visible. Users joining via supported browsers (Google Chrome currently) can opt in to have their browser provide transcription as they speak.

## Plugin Versioning

Please be aware that we have a separate branch of this plugin for each version of the SDK. This ensures that everything merged into a branch is compatible with the corresponding version of the BigBlueButton core. As of now, here’s the correspondence between the branches, SDK versions, and BigBlueButton core versions:

| Repository Branch | Plugin-SDK Version | BigBlueButton Core Version |
|------------------|--------------------|----------------------------|
| v0.0.x           | v0.0.x             | v3.0.x                     |
| v0.1.x           | v0.1.x             | v3.1.x                     |

For more information about the plugin API features, see the documentation (`readme` files) within the specific branch you are interested in. We separate the branches because, going forward, `v0.1.x` is becoming more and more different from `v0.0.x`.

If you have any suggestions, requirements, or questions, don’t hesitate to contact us.

## Building the Plugin

To build the plugin for production use, follow these steps:

```bash
cd $HOME/src/plugin-live-transcription
npm ci
npm run build-bundle
```

The above command will generate the `dist` folder, containing the bundled JavaScript file named `<plugin-name>.js`. This file can be hosted on any HTTPS server along with its `manifest.json`. You can copy the entire content of `dist/` to include localizations too.

If you install the Plugin separated from the manifest, remember to change the `javascriptEntrypointUrl` in the `manifest.json` to the correct endpoint.

To use the plugin in BigBlueButton, send this parameter along in create call:

```
pluginManifests=[{"url":"<your-domain>/path/to/manifest.json"}]
```

Or additionally, you can add this same configuration in the `.properties` file from `bbb-web` in `/etc/bigbluebutton/bbb-web.properties`

## Development mode

As for development mode (running this plugin from source), please refer back to [https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk](https://github.com/bigbluebutton/bigbluebutton-html-plugin-sdk) section `Running the Plugin from Source`
