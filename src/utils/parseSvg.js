export default function parseSvg(svg, filled) {
  svg = svg.replaceAll(
    /stroke="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/g,
    'stroke={color}'
  );

  if (!filled) {
    svg = svg.replaceAll(
      /stroke-linecap="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi,
      'stroke-linecap={strokeLinecap}'
    );

    svg = svg.replaceAll(
      /stroke="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/g,
      'fill={color}'
    );

    svg = svg.replaceAll(
      /stroke-linejoin="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi,
      'stroke-linejoin={strokeLinejoin}'
    );

    svg = svg.replaceAll(
      /stroke-width="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/gi,
      'stroke-width={strokeWidth}'
    );
  } else {
    svg = svg.replaceAll(/fill="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/g, 'fill={color}');
  }

  svg = svg.replaceAll(
    /(?<= )width="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/g,
    'width={size}'
  );
  svg = svg.replaceAll(
    /(?<= )height="[a-zA-Z0-9:;\.\s\(\)\-\,]*"/g,
    'height={size}'
  );
  return svg;
}
