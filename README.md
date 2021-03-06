

# Welcome to *U=RIsolve* Application!

<a href="https://urisolve.pt">
<img src="/docker/build/img/logo_350px.png" alt="alt text" width="300" align="right">
</a>

*U=RIsolve* is a web-based framework for teaching and self-learning circuit analysis methods. This app uses a circuit description model (netlist) generated by the QUCS simulator to produce a straightforward demonstration of the analysis process. *U=RIsolve* enables:

1. Students to learn how to **apply** the circuit analysis methodologies.
2. Students to **compare** their resolution with the *U=RIsolve* output.
3. Educators to **produce** off-class and in-class examples.

## Getting Started

These will get you a copy of the project up and running on your local machine either for development and testing purposes.

### Prerequisites

[Docker Desktop](https://docs.docker.com/get-docker/): the building framework used

### Installing

Clone the *U=RIsolve* repository
```
git clone https://github.com/txroot/urisolve.git
```

Build and push the *base* version
```
cd ./base && docker build -t docker.pkg.github.com/txroot/urisolve/webappx64:base .
```
```
docker push docker.pkg.github.com/txroot/urisolve/webappx64:base .
```

Build and push the *stable* version
```
cd ../build && docker build -t docker.pkg.github.com/txroot/urisolve/webappx64:stable .
```
```
docker push docker.pkg.github.com/txroot/urisolve/webappx64:stable .
```

After any alterations, repeat the build command for the stable version and run the *compose*
```
docker build -t docker.pkg.github.com/txroot/urisolve/webappx64:stable . && docker-compose up -d
```

### Running
The Apache HTTP Server will be hosted on your local machine
```
http://localhost
```

## Contacts

We are open to suggestions on how to improve this framework, feel free to ask any questions and to try *U=RIsolve*

[U=RIsolve](https://urisolve.pt) &ndash; application website

[E-mail](mailto:info@urisolve.pt) &ndash; our e-mail address

## Authors

- **Mário Alves**

- **Francisco Pereira**

- **André Rocha** &ndash; [txroot](https://github.com/txroot])

- **Lino Sousa**  &ndash; [Lino Sousa](https://github.com/Lino-Sousa])


