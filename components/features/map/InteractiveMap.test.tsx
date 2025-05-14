import { render, screen, fireEvent } from '@testing-library/react';
import InteractiveMap from './InteractiveMap';
import '@testing-library/jest-dom';

// Mock the react-leaflet components as they require a DOM environment
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children, ...props }) => <div data-testid="map-container" {...props}>{children}</div>,
  TileLayer: () => null, // Mock TileLayer as it's not needed for basic rendering test
  Marker: ({ children }) => <div data-testid="map-marker">{children}</div>,
  Popup: ({ children }) => <div data-testid="map-popup">{children}</div>,
}));

// Mock the Sanity image URL builder
jest.mock('@/lib/sanityClient', () => ({
  urlForImage: (source) => ({
    url: () => `mock-image-url-${source.asset._ref}`,
  }),
}));

// Mock @portabletext/react
jest.mock('@portabletext/react', () => ({
  PortableText: ({ value }) => <div data-testid="portable-text">{JSON.stringify(value)}</div>,
}));


describe('InteractiveMap', () => {
  const mockLocations = [
    {
      _id: '1',
      name: 'Location 1',
      coordinates: { lat: 7.1941, lng: 5.3407 },
      description: [{ _key: 'a', _type: 'block', children: [{ _key: 'a', _type: 'span', marks: [], text: 'Description 1' }], markDefs: [], style: 'normal' }],
      cultural_significance: 'Significance 1',
      media: [{ _key: 'img1', _type: 'image', asset: { _ref: 'image-abc-123' } }],
    },
    {
      _id: '2',
      name: 'Location 2',
      coordinates: { lat: 9.0820, lng: 8.6753 },
      description: [{ _key: 'b', _type: 'block', children: [{ _key: 'b', _type: 'span', marks: [], text: 'Description 2' }], markDefs: [], style: 'normal' }],
      cultural_significance: 'Significance 2',
      media: [{ _key: 'vid1', _type: 'file', asset: { _ref: 'file-xyz-456.mp4' } }],
    },
  ];

  it('renders the map container', () => {
    render(<InteractiveMap locations={[]} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('renders markers for each location', () => {
    render(<InteractiveMap locations={mockLocations} />);
    const markers = screen.getAllByTestId('map-marker');
    expect(markers).toHaveLength(mockLocations.length);
  });

  it('renders popups with correct information for each location', () => {
    render(<InteractiveMap locations={mockLocations} />);
    const popups = screen.getAllByTestId('map-popup');
    expect(popups).toHaveLength(mockLocations.length);

    // You could add more specific assertions here to check the content within popups
    // For example, checking for location names, descriptions, etc.
    // screen.getByText('Location 1');
    // screen.getByText('Significance 1');
  });

  it('renders popup content correctly for a location with an image', () => {
    render(<InteractiveMap locations={[mockLocations[0]]} />); // Render with a single location that has an image
    const popup = screen.getByTestId('map-popup');

    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByTestId('portable-text')).toHaveTextContent(JSON.stringify(mockLocations[0].description));
    expect(screen.getByText('Significance 1')).toBeInTheDocument();

    const imageElement = popup.querySelector('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', `mock-image-url-${mockLocations[0].media[0].asset._ref}`);
  });

  it('renders popup content correctly for a location with a video', () => {
    render(<InteractiveMap locations={[mockLocations[1]]} />); // Render with a single location that has a video
    const popup = screen.getByTestId('map-popup');

    expect(screen.getByText('Location 2')).toBeInTheDocument();
    expect(screen.getByTestId('portable-text')).toHaveTextContent(JSON.stringify(mockLocations[1].description));
    expect(screen.getByText('Significance 2')).toBeInTheDocument();

    const videoElement = popup.querySelector('video');
    expect(videoElement).toBeInTheDocument();
    const sourceElement = videoElement?.querySelector('source');
    expect(sourceElement).toBeInTheDocument();
    expect(sourceElement).toHaveAttribute('src', `mock-image-url-${mockLocations[1].media[0].asset._ref}`);
    expect(sourceElement).toHaveAttribute('type', 'video/mp4');
  });

  it('renders popup content correctly for a location with only text', () => {
    const locationWithOnlyText = {
      _id: '3',
      name: 'Location 3',
      coordinates: { lat: 6.5244, lng: 3.3792 },
      description: [{ _key: 'c', _type: 'block', children: [{ _key: 'c', _type: 'span', marks: [], text: 'Description 3' }], markDefs: [], style: 'normal' }],
      cultural_significance: 'Significance 3',
      media: [], // No media
    };
    render(<InteractiveMap locations={[locationWithOnlyText]} />);
    const popup = screen.getByTestId('map-popup');

    expect(screen.getByText('Location 3')).toBeInTheDocument();
    expect(screen.getByTestId('portable-text')).toHaveTextContent(JSON.stringify(locationWithOnlyText.description));
    expect(screen.getByText('Significance 3')).toBeInTheDocument();

    const imageElement = popup.querySelector('img');
    expect(imageElement).not.toBeInTheDocument();
    const videoElement = popup.querySelector('video');
    expect(videoElement).not.toBeInTheDocument();
  });

  it('displays the correct popup content when a marker is clicked', () => {
    render(<InteractiveMap locations={mockLocations} />);
    const markers = screen.getAllByTestId('map-marker');

    // Simulate clicking the first marker
    fireEvent.click(markers[0]);

    // The popup for the first location should now be visible
    const popup = screen.getByTestId('map-popup');
    expect(popup).toBeInTheDocument();

    // Verify the content of the popup for the first location
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByTestId('portable-text')).toHaveTextContent(JSON.stringify(mockLocations[0].description));
    expect(screen.getByText('Significance 1')).toBeInTheDocument();

    const imageElement = popup.querySelector('img');
    expect(imageElement).toBeInTheDocument();
    expect(imageElement).toHaveAttribute('src', `mock-image-url-${mockLocations[0].media[0].asset._ref}`);

    // Ensure the video element is NOT present in this popup
    const videoElement = popup.querySelector('video');
    expect(videoElement).not.toBeInTheDocument();

    // Simulate clicking the second marker
    fireEvent.click(markers[1]);

    // The popup for the second location should now be visible (the first one might be gone or hidden depending on leaflet's behavior, but we focus on the new one)
    const secondPopup = screen.getByTestId('map-popup'); // Assuming only one popup is open at a time
     expect(secondPopup).toBeInTheDocument();

    // Verify the content of the popup for the second location
    expect(screen.getByText('Location 2')).toBeInTheDocument();
    expect(screen.getByTestId('portable-text')).toHaveTextContent(JSON.stringify(mockLocations[1].description));
    expect(screen.getByText('Significance 2')).toBeInTheDocument();

    const secondImageElement = secondPopup.querySelector('img');
    expect(secondImageElement).not.toBeInTheDocument();
    const secondVideoElement = secondPopup.querySelector('video');
    expect(secondVideoElement).toBeInTheDocument();
     const secondSourceElement = secondVideoElement?.querySelector('source');
    expect(secondSourceElement).toBeInTheDocument();
    expect(secondSourceElement).toHaveAttribute('src', `mock-image-url-${mockLocations[1].media[0].asset._ref}`);
    expect(secondSourceElement).toHaveAttribute('type', 'video/mp4');
  });
});