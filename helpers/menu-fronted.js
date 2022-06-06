 const getMenuFrontEnd = (role = "USER_ROLE") => {
  const menu = [
    {
      titulo: "Dashboard",
      icono: "mdi mdi-gauge",
      subMenu: [
        {
          titulo: "Main",
          url: "/",
        },
        {
          titulo: "ProgressBar",
          url: "progress",
        },
        {
          titulo: "Graficas",
          url: "graficaum",
        },
        {
          titulo: "Promesas",
          url: "promesas",
        },
        {
          titulo: "Rxjs",
          url: "rxjs",
        },
      ],
    },
    {
      titulo: "Mantenimientos",
      icono: "mdi mdi-folder-lock-open",
      subMenu: [
        // {
        //   titulo: "Usuarios",
        //   url: "usuarios",
        // },
        {
          titulo: "Hospitales",
          url: "hospitales",
        },
        {
          titulo: "Medicos",
          url: "medicos",
        },
      ],
    },
  ];

//Vamos a restringir el menu para quien no es admin.
// si es admin, agregamos en el menu la opcion de mantenimiento de usuarios

  if (role === "ADMIN_ROLE") {
    menu[1].subMenu.unshift( {
        titulo: "Usuarios",
        url: "usuarios",
      });
  }

  return menu;
};

module.exports = {
    getMenuFrontEnd
}