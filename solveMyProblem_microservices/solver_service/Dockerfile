FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install


# Install Python, pip, and system dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    cmake \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Create and activate a Python virtual environment
RUN python3 -m venv /opt/venv

# Activate the virtual environment and install OR-Tools
RUN /opt/venv/bin/pip install --upgrade pip && /opt/venv/bin/pip install ortools

# Ensure the virtual environment is activated for all future commands
ENV PATH="/opt/venv/bin:$PATH"
COPY . .

# Temporarily use a shell instead of starting the app
CMD ["node", "app.js"]
