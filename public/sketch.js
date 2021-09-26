function setup() {
  if ('geolocation' in navigator) {
    console.log('Geolocation available');

    noCanvas();
    const vid = createCapture(VIDEO);
    vid.size(320, 240);

    document.getElementById('smb').addEventListener('click', () => {
      navigator.geolocation.getCurrentPosition(async pos => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const time = new Date(Date.now()).toDateString();
        const mood = document.getElementById('mood').value;
        vid.loadPixels();
        const image64 = vid.canvas.toDataURL();

        document.getElementById('lat').textContent = lat
        document.getElementById('lon').textContent = lon
        document.getElementById('ts').textContent = time

        const data = {
          lat,
          lon,
          mood,
          time,
          image64
        }

        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        }

        const res = await fetch('/api', options);

        const final = await res.json();
        console.log(final);
      })
    });
  } else {
    console.log('Geolocation unavailable');
  }
}