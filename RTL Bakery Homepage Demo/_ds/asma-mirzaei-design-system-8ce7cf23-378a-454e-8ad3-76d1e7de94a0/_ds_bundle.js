/* @ds-bundle: {"format":3,"namespace":"AsmaMirzaeiDesignSystem_8ce7cf","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"FilterBar","sourcePath":"components/gallery/FilterBar.jsx"},{"name":"GalleryGrid","sourcePath":"components/gallery/GalleryGrid.jsx"},{"name":"SectionHeader","sourcePath":"components/sections/SectionHeader.jsx"},{"name":"ServiceCard","sourcePath":"components/sections/ServiceCard.jsx"},{"name":"StatCard","sourcePath":"components/sections/StatCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"948b78676282","components/core/Button.jsx":"4a8e3ddc4e37","components/core/Card.jsx":"aab28518c3a2","components/core/Input.jsx":"f12bc82deed7","components/gallery/FilterBar.jsx":"44ebe2bbf4bc","components/gallery/GalleryGrid.jsx":"c3c3f10e1304","components/sections/SectionHeader.jsx":"4e650593ef24","components/sections/ServiceCard.jsx":"abbde0dfc1a8","components/sections/StatCard.jsx":"35f4eab88f76"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AsmaMirzaeiDesignSystem_8ce7cf = window.AsmaMirzaeiDesignSystem_8ce7cf || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
var variantStyles = {
  default: {
    background: 'var(--primary)',
    color: 'var(--primary-foreground)'
  },
  secondary: {
    background: 'var(--secondary)',
    color: 'var(--secondary-foreground)'
  },
  muted: {
    background: 'var(--muted)',
    color: 'var(--muted-foreground)'
  },
  outline: {
    background: 'transparent',
    color: 'var(--foreground)',
    border: '1px solid var(--border)'
  }
};
function Badge(props) {
  var variant = props.variant || 'secondary';
  var children = props.children;
  var style = props.style || {};
  var base = Object.assign({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 1.5,
    padding: '3px 10px',
    borderRadius: '9999px',
    whiteSpace: 'nowrap'
  }, variantStyles[variant] || variantStyles.secondary, style);
  return React.createElement('span', {
    style: base
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const {
  useState
} = React;
var variantStyles = {
  default: function (hov) {
    return {
      background: 'var(--primary)',
      color: 'var(--primary-foreground)',
      border: '1.5px solid transparent',
      boxShadow: hov ? '0 4px 16px rgba(217,142,136,0.4)' : 'none',
      transform: hov ? 'translateY(-2px)' : 'none'
    };
  },
  secondary: function (hov) {
    return {
      background: 'var(--secondary)',
      color: 'var(--secondary-foreground)',
      border: '1.5px solid transparent',
      opacity: hov ? 0.82 : 1
    };
  },
  outline: function (hov) {
    return {
      background: hov ? 'var(--muted)' : 'var(--card)',
      color: 'var(--foreground)',
      border: hov ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
      color: hov ? 'var(--primary)' : 'var(--foreground)'
    };
  },
  ghost: function (hov) {
    return {
      background: hov ? 'var(--muted)' : 'transparent',
      color: 'var(--foreground)',
      border: '1.5px solid transparent'
    };
  },
  link: function (hov) {
    return {
      background: 'transparent',
      color: 'var(--primary)',
      border: 'none',
      padding: 0,
      textDecoration: hov ? 'underline' : 'none',
      textUnderlineOffset: '4px'
    };
  }
};
var sizeMap = {
  xs: {
    padding: '4px 12px',
    fontSize: '0.75rem'
  },
  sm: {
    padding: '6px 16px',
    fontSize: '0.8125rem'
  },
  md: {
    padding: '10px 24px',
    fontSize: '0.875rem'
  },
  lg: {
    padding: '14px 32px',
    fontSize: '1rem'
  }
};
function Button(props) {
  var variant = props.variant || 'default';
  var size = props.size || 'md';
  var pill = props.pill !== false;
  var disabled = props.disabled || false;
  var children = props.children;
  var onClick = props.onClick;
  var href = props.href;
  var style = props.style || {};
  var hov = useState(false);
  var isHov = hov[0];
  var setHov = hov[1];
  var vStyle = (variantStyles[variant] || variantStyles.default)(isHov && !disabled);
  var sStyle = sizeMap[size] || sizeMap.md;
  var base = Object.assign({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-sans)',
    fontWeight: 600,
    lineHeight: 1.5,
    borderRadius: pill ? '9999px' : 'var(--radius-lg)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : undefined,
    transition: 'all 0.18s ease',
    outline: 'none',
    userSelect: 'none',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box'
  }, vStyle, sStyle, style);
  var Tag = href ? 'a' : 'button';
  return React.createElement(Tag, {
    style: base,
    disabled: !href && disabled,
    onClick: !disabled ? onClick : undefined,
    href: href,
    onMouseEnter: function () {
      setHov(true);
    },
    onMouseLeave: function () {
      setHov(false);
    }
  }, children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
var paddingMap = {
  sm: '12px',
  md: '20px',
  lg: '28px',
  xl: '36px'
};
function Card(props) {
  var padding = props.padding || 'md';
  var children = props.children;
  var style = props.style || {};
  var base = Object.assign({
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-2xl)',
    padding: paddingMap[padding] || paddingMap.md,
    fontFamily: 'var(--font-sans)',
    color: 'var(--card-foreground)',
    boxSizing: 'border-box'
  }, style);
  return React.createElement('div', {
    style: base
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
const {
  useState
} = React;
function Input(props) {
  var type = props.type || 'text';
  var placeholder = props.placeholder;
  var value = props.value;
  var onChange = props.onChange;
  var label = props.label;
  var name = props.name;
  var required = props.required;
  var multiline = props.multiline || false;
  var rows = props.rows || 4;
  var style = props.style || {};
  var focused = useState(false);
  var isFocused = focused[0];
  var setFocused = focused[1];
  var inputStyle = {
    width: '100%',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.875rem',
    lineHeight: 1.5,
    color: 'var(--foreground)',
    background: 'var(--card)',
    border: isFocused ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
    borderRadius: 'var(--radius-xl)',
    padding: '10px 16px',
    outline: 'none',
    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
    boxShadow: isFocused ? '0 0 0 3px rgba(217,142,136,0.18)' : 'none',
    boxSizing: 'border-box',
    resize: multiline ? 'vertical' : 'none',
    minHeight: multiline ? rows * 24 + 20 + 'px' : undefined
  };
  var labelStyle = {
    fontFamily: 'var(--font-sans)',
    fontSize: '0.8125rem',
    fontWeight: 600,
    color: 'var(--foreground)',
    marginBottom: '6px',
    display: 'block'
  };
  var wrapStyle = Object.assign({
    display: 'flex',
    flexDirection: 'column',
    width: '100%'
  }, style);
  var Tag = multiline ? 'textarea' : 'input';
  return React.createElement('div', {
    style: wrapStyle
  }, label ? React.createElement('label', {
    style: labelStyle
  }, label) : null, React.createElement(Tag, {
    type: !multiline ? type : undefined,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    name: name,
    required: required,
    rows: multiline ? rows : undefined,
    style: inputStyle,
    onFocus: function () {
      setFocused(true);
    },
    onBlur: function () {
      setFocused(false);
    }
  }));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/gallery/FilterBar.jsx
try { (() => {
const {
  useState
} = React;
function FilterItem(props) {
  var label = props.label;
  var active = props.active;
  var direction = props.direction;
  var onClick = props.onClick;
  var hov = useState(false);
  var isHov = hov[0];
  var setHov = hov[1];
  return React.createElement('li', null, React.createElement('button', {
    type: 'button',
    onClick: onClick,
    onMouseEnter: function () {
      setHov(true);
    },
    onMouseLeave: function () {
      setHov(false);
    },
    style: {
      display: 'block',
      fontFamily: 'var(--font-sans)',
      fontSize: '0.875rem',
      fontWeight: active ? 600 : 400,
      padding: '6px 16px',
      borderRadius: direction === 'column' ? 'var(--radius-lg)' : '9999px',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.15s ease',
      background: active ? 'var(--secondary)' : 'transparent',
      color: active ? 'var(--primary)' : isHov ? 'var(--foreground)' : 'var(--muted-foreground)',
      outline: 'none',
      whiteSpace: 'nowrap',
      textAlign: direction === 'column' ? 'start' : 'center'
    }
  }, label));
}
function FilterBar(props) {
  var filters = props.filters || [];
  var active = props.active;
  var onChange = props.onChange;
  var direction = props.direction || 'row';
  var style = props.style || {};
  var base = Object.assign({
    display: 'flex',
    flexDirection: direction,
    flexWrap: 'wrap',
    gap: direction === 'row' ? '8px' : '4px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontFamily: 'var(--font-sans)'
  }, style);
  return React.createElement('ul', {
    style: base
  }, filters.map(function (f) {
    return React.createElement(FilterItem, {
      key: f,
      label: f,
      active: active === f,
      direction: direction,
      onClick: function () {
        onChange && onChange(f);
      }
    });
  }));
}
Object.assign(__ds_scope, { FilterBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/gallery/FilterBar.jsx", error: String((e && e.message) || e) }); }

// components/gallery/GalleryGrid.jsx
try { (() => {
const {
  useState
} = React;
function GalleryCell(props) {
  var src = props.src;
  var alt = props.alt;
  var onClick = props.onClick;
  var hov = useState(false);
  var isHov = hov[0];
  var setHov = hov[1];
  return React.createElement('div', {
    role: 'button',
    tabIndex: 0,
    onClick: onClick,
    onMouseEnter: function () {
      setHov(true);
    },
    onMouseLeave: function () {
      setHov(false);
    },
    onKeyDown: function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick && onClick();
      }
    },
    style: {
      position: 'relative',
      aspectRatio: '1 / 1',
      overflow: 'hidden',
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border)',
      background: 'var(--muted)',
      cursor: 'pointer'
    }
  }, src ? React.createElement('img', {
    src: src,
    alt: alt || '',
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease',
      transform: isHov ? 'scale(1.05)' : 'scale(1)'
    }
  }) : null);
}
function GalleryGrid(props) {
  var items = props.items || [];
  var columns = props.columns || 3;
  var gap = props.gap || 16;
  var onItemClick = props.onItemClick;
  var style = props.style || {};
  var gridStyle = Object.assign({
    display: 'grid',
    gridTemplateColumns: 'repeat(' + columns + ', 1fr)',
    gap: gap + 'px'
  }, style);
  return React.createElement('div', {
    style: gridStyle
  }, items.map(function (item, i) {
    return React.createElement(GalleryCell, {
      key: item.id || i,
      src: item.src,
      alt: item.alt,
      onClick: function () {
        onItemClick && onItemClick(i);
      }
    });
  }));
}
Object.assign(__ds_scope, { GalleryGrid });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/gallery/GalleryGrid.jsx", error: String((e && e.message) || e) }); }

// components/sections/SectionHeader.jsx
try { (() => {
function SectionHeader(props) {
  var title = props.title || '';
  var accent = props.accent;
  var subtitle = props.subtitle;
  var style = props.style || {};
  return React.createElement('div', {
    style: Object.assign({
      fontFamily: 'var(--font-sans)'
    }, style)
  }, React.createElement('h2', {
    style: {
      fontSize: 'clamp(2rem, 5vw, 3rem)',
      fontWeight: 900,
      lineHeight: 1.15,
      color: 'var(--foreground)',
      margin: 0,
      textWrap: 'balance'
    }
  }, title, accent ? React.createElement('span', {
    style: {
      color: 'var(--primary)'
    }
  }, accent) : null), subtitle ? React.createElement('p', {
    style: {
      marginTop: '16px',
      marginBottom: 0,
      fontSize: '1rem',
      lineHeight: 1.65,
      color: 'var(--muted-foreground)',
      maxWidth: '28rem'
    }
  }, subtitle) : null);
}
Object.assign(__ds_scope, { SectionHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/SectionHeader.jsx", error: String((e && e.message) || e) }); }

// components/sections/ServiceCard.jsx
try { (() => {
function ServiceCard(props) {
  var Icon = props.icon;
  var title = props.title || '';
  var body = props.body || '';
  var variant = props.variant || 'default';
  var style = props.style || {};
  var isAlt = variant === 'secondary';
  return React.createElement('div', {
    style: Object.assign({
      background: isAlt ? 'rgba(251,246,238,0.6)' : 'var(--card)',
      border: isAlt ? 'none' : '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      padding: '24px',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box'
    }, style)
  }, React.createElement('div', {
    style: {
      width: '44px',
      height: '44px',
      borderRadius: 'var(--radius-xl)',
      background: isAlt ? 'var(--background)' : 'var(--secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary)',
      flexShrink: 0
    }
  }, Icon ? React.createElement(Icon, {
    size: 20
  }) : null), React.createElement('h3', {
    style: {
      marginTop: '16px',
      marginBottom: 0,
      fontWeight: 700,
      fontSize: '0.9375rem',
      color: isAlt ? 'var(--secondary-foreground)' : 'var(--foreground)'
    }
  }, title), React.createElement('p', {
    style: {
      marginTop: '8px',
      marginBottom: 0,
      fontSize: '0.875rem',
      lineHeight: 1.65,
      color: isAlt ? 'var(--secondary-foreground)' : 'var(--muted-foreground)',
      opacity: isAlt ? 0.82 : 1
    }
  }, body));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/sections/StatCard.jsx
try { (() => {
function StatCard(props) {
  var value = props.value || '';
  var label = props.label || '';
  var style = props.style || {};
  return React.createElement('div', {
    style: Object.assign({
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      padding: '20px 12px',
      textAlign: 'center',
      fontFamily: 'var(--font-sans)',
      boxSizing: 'border-box'
    }, style)
  }, React.createElement('dt', {
    style: {
      fontSize: 'clamp(1.5rem, 4vw, 2rem)',
      fontWeight: 900,
      color: 'var(--primary)',
      margin: 0,
      display: 'block'
    }
  }, value), React.createElement('dd', {
    style: {
      marginTop: '8px',
      marginLeft: 0,
      fontSize: '0.75rem',
      lineHeight: 1.65,
      color: 'var(--muted-foreground)'
    }
  }, label));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/sections/StatCard.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.FilterBar = __ds_scope.FilterBar;

__ds_ns.GalleryGrid = __ds_scope.GalleryGrid;

__ds_ns.SectionHeader = __ds_scope.SectionHeader;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.StatCard = __ds_scope.StatCard;

})();
