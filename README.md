# smartCARS 3 announcements plugin

## For users

After installation, navigate to where smartCARS 3 is installed (default `%localappdata%\TFDi Design\smartCARS`).
Within this directory, navigate to `resources\app\dist\plugins\com.khofmann.announcements\background\soundpacks`.

To add an additional airline soundpack, create a new directory named with the airlines ICAO code, e.g. `dlh` for Lufthansa.
Place your `.wav` files in this directory. The naming schema can be seen in the `default` soundpack.

It is advisable to uninstall the official Announcements plugin, its features are fully integrated in this version.

Always keep a backup of your additional soundsets. Any updates for the plugin will reset the plugin's directory, thus
removing any additional soundpacks.

## For devs

This repository contains an example plugin for playing our crew announcements for your flight.

You are free to fork, modify and distribute the contents of this repository as per the license agreement.

In order to get started with development:

```shell
npm install
```

To make a production build of the plugin:

```shell
npm run build
```