# Integration Tests

__The integration tests need explicit activation by setting the ``skip.integration.tests`` system property to *false*.__

All tests require a running Graylog server to run against, which is not bootstrapped by Maven but supposedly
by the environment the integration tests are running on. Therefore, the tests have a number of tunable parameters
with (hopefully) reasonable defaults.

| Property                   | Default                    | Description                                                                          |
|:---------------------------|:---------------------------|:-------------------------------------------------------------------------------------|
| ``skip.integration.tests`` | ``true``                   | Enables the integration tests. (Disabled per default)                                |
| ``gl.port``                | ``12900``                  | TCP port of the Graylog server.                                                      |
| ``gl.baseuri``             | ``http://localhost:12900`` | Uri base of the Graylog server. Port is overridden by ``gl.port`` if specified.      |
| ``gl.admin_user``          | ``admin``                  | Username used for authenticating against server for authenticated requests.          |
| ``gl.admin_password``      | ``admin``                  | Password used for authenticating against server for authenticated requests.          |
| ``mongodb.host``           | ``localhost``              | Hostname of MongoDB server used for seeding tests that require a preseeded database. |
| ``mongodb.port``           | ``27017``                  | TCP port of MongoDB server.                                                          |
| ``mongodb.database``       | ``graylog_test``           | Default database name for MongoDB. Tests are able to override this.                  |
| ``es.host``                | ``localhost``              | Hostname used for connecting to Elasticsearch cluster during pre-seeding.            |
| ``es.cluster.name``        | ``graylog_test``           | Elasticsearch cluster name used during connecting.                                   |
| ``es.port``                | ``9300``                   | Elasticsearch port used during connecting.                                           |

All tunable parameters are passed as Java system properties (i.e. by adding ``-Dmongodb.database=integration`` to the
Maven command to define a different default MongoDB database).


## Docker

The integration tests can also be run locally using Docker containers for its dependencies (Graylog, Elasticsearch,
and MongoDB).

__NOTE:__ On Mac OS X and Windows you might need to install [Docker](https://www.docker.com/docker-engine) and
[Docker Machine](https://docs.docker.com/machine/) using [Docker Toolbox](https://www.docker.com/docker-toolbox).

Once `docker-machine` is available on the machine, the prepared virtual machine ("default" in this example) can be
started using the following commands:

    # Start virtual machine "default"
    docker-machine start default

    # Read in environment variables for virtual machine "default"
    eval "$(docker-machine env default)"


In order to run the most recent Graylog build, the Maven Assembly plugin has to be invoked to build the distribution
tar-ball with the following command:

    mvn assembly:single


Once Docker has been started and the tar-ball has been built, the integration tests can be run with the following
command (inside the `integration-tests` directory):

    mvn -Pdocker -Dskip.integration.tests=false verify


If only the running Docker containers are being required (e. g. during development of the integration tests), those can
be started/stopped with the following commands (inside the `integration-tests` directory):

    # Build Docker container with the latest Graylog tar-ball
    mvn -Pdocker docker:build

    # Start Docker containers
    mvn -Pdocker docker:start

    # Stop Docker containers
    mvn -Pdocker docker:stop


Additional sources:

* [Docker Maven plugin](https://github.com/rhuss/docker-maven-plugin)
* [Docker Maven plugin documentation](http://ro14nd.de/docker-maven-plugin/index.html)
