# Building Guyrá

## Building the Docker Image

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/Gyyyn/guyra.git
    cd guyra
    ```

2. **Build the Image:**

    From the root of the project directory, run the following command to build the Docker image:

    ```bash
    docker build -t guyra-app .
    docker run -p 8080:80 guyra
    ```

    This command will read the `Dockerfile`, download the necessary dependencies, and create a Docker image named `guyra-app`.

After starting the container, you can access the Guyra application by opening your web browser and navigating to:

[http://localhost:8080](http://localhost:8080)

## Customization

### Changing the Port

If you need to run the application on a different port, you can change the port mapping in the `docker run` command. For example, to run on port 8000, you would use:

```bash
docker run -p 8000:80 guyra-app
```

### Development

For development, you might want to mount the local source code into the container to see changes without rebuilding the image. You can do this with a volume mount:

```bash
docker run -p 8080:80 -v $(pwd):/var/www/html guyra-app
```

This command mounts the current directory on your host machine to `/var/www/html` inside the container.
