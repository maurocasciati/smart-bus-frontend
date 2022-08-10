# Welcome to Escol.ar 🚌

## What does it do?
Escol.ar is a geolocalization solution built to connect School Bus drivers with schools and student's parents to ensure safe travels and solve organizational issues faced daily by transport operators. Escol.ar keep track of the location of the school bus in real=time to allow parents anticipate its arrival and follow it to the school, at the same time it helps the driver to find the best route and register every stop to provide historical records.

## How it is implemented?
This app is written in [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) platform and [Typescript](https://www.typescriptlang.org/). It connects with our [.Net](https://dotnet.microsoft.com/en-us/) backend service (see the repo [here](https://github.com/nicolasespindola/smart-bus-backend)) and our [MSSQL Server Management Studio](https://aka.ms/ssmsfullsetup) database and with external services such as [Google Maps Platform](https://mapsplatform.google.com/), which allow us to render maps and trace directions, and [PubNub](https://www.pubnub.com/) share the current position in real time.
<p align="middle">
  <img src="https://github.com/maurocasciati/smart-bus-frontend/blob/development/.docs/architecture.png?raw=true" width="600" />
</p>

## How does it looks like?
### *Awesome!* Take a look:
<p align="middle">
  <img src="https://github.com/maurocasciati/smart-bus-frontend/blob/development/.docs/recorrido.gif?raw=true" width="240" />
  <img src="https://github.com/maurocasciati/smart-bus-frontend/blob/development/.docs/tutor-historial.gif?raw=true" width="240" /> 
  <img src="https://github.com/maurocasciati/smart-bus-frontend/blob/development/.docs/tutor-recorrido.gif" width="240" />
</p>

## Can I test it?
### For sure!
But not just now 😅 I will share the details about the requirements and how to run the app soon. Stay tuned!
