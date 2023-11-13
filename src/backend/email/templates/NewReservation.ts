import * as handlebars from "handlebars";

const NewReservationTemplate = `<!DOCTYPE html>
<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">

<head>
	<title></title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0"><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]--><!--[if !mso]><!-->
	<link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet" type="text/css">
	<link href="https://fonts.googleapis.com/css2?family=Hind:wght@400;700&amp;display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
	<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:660px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.mobile_hide {
				display: none;
			}

			.row-content {
				width: 100% !important;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}

			.reverse {
				display: table;
				width: 100%;
			}

			.reverse .column.first {
				display: table-footer-group !important;
			}

			.reverse .column.last {
				display: table-header-group !important;
			}

			.row-4 td.column.first .border,
			.row-4 td.column.last .border {
				padding: 5px 0;
				border-top: 0;
				border-right: 0px;
				border-bottom: 0;
				border-left: 0;
			}
		}
	</style>
</head>

<body style="background-color: #f3ecb3; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">
	<table class="nl-container" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f3ecb3;">
		<tbody>
			<tr>
				<td>
					<table class="row row-1" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 640px; margin: 0 auto;" width="640">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-2" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9fdbad; color: #000; width: 640px; margin: 0 auto;" width="640">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="width:100%;">
																<div class="alignment" align="center" style="line-height:10px"><img src="https://400208c20c.imgdist.com/public/users/Integrators/BeeProAgency/1091071_1076449/TablerBrandDjango.png" style="display: block; height: auto; border: 0; max-width: 128px; width: 100%;" width="128"></div>
															</td>
														</tr>
													</table>
													<table class="heading_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-left:20px;padding-right:20px;padding-top:5px;text-align:center;width:100%;">
																<h1 style="margin: 0; color: #434852; direction: ltr; font-family: Hind, Nunito, Arial, sans-serif; font-size: 46px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><strong>Nueva solicitud de reserva registrada</strong></h1>
															</td>
														</tr>
													</table>
													<table class="heading_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;text-align:center;width:100%;">
																<h2 style="margin: 0; color: #434852; direction: ltr; font-family: Hind, Nunito, Arial, sans-serif; font-size: 19px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: center; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Te avisaremos cuando el establecimiento la confirme, por lo pronto.. empeza a preparar las zapas, a estirar.. Ya estas cerca de jugar!</span></h2>
															</td>
														</tr>
													</table>
													<table class="heading_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-left:20px;padding-right:20px;padding-top:30px;text-align:center;width:100%;">
																<h2 style="margin: 0; color: #434852; direction: ltr; font-family: Hind, Nunito, Arial, sans-serif; font-size: 30px; font-weight: 700; letter-spacing: normal; line-height: 120%; text-align: left; margin-top: 0; margin-bottom: 0;"><span class="tinyMce-placeholder">Tu reserva solicitada:</span></h2>
															</td>
														</tr>
													</table><!--[if mso]><style>#list-r1c0m4 ul{margin: 0 !important; padding: 0 !important;} #list-r1c0m4 ul li{mso-special-format: bullet;}#list-r1c0m4 .levelOne li {margin-top: 0 !important;} #list-r1c0m4 .levelOne {margin-left: -20px !important;}#list-r1c0m4 .levelTwo li {margin-top: 0 !important;} #list-r1c0m4 .levelTwo {margin-left: 10px !important;}#list-r1c0m4 .levelThree li {margin-top: 0 !important;} #list-r1c0m4 .levelThree {margin-left: 40px !important;}#list-r1c0m4 .levelFour li {margin-top: 0 !important;} #list-r1c0m4 .levelFour {margin-left: 70px !important;}#list-r1c0m4 .levelFive li {margin-top: 0 !important;} #list-r1c0m4 .levelFive {margin-left: 100px !important;}#list-r1c0m4 .levelSix li {margin-top: 0 !important;} #list-r1c0m4 .levelSix {margin-left: 130px !important;}</style><![endif]-->
													<table class="list_block block-5" id="list-r1c0m4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:10px;padding-left:20px;padding-right:10px;">
																<div class="levelOne" style="margin-left: 0;">
																	<ul class="leftList" start="1" style="margin-top: 0; margin-bottom: 0; padding: 0; padding-left: 20px; color: #101112; direction: ltr; font-family: Hind,Nunito,Arial,sans-serif; font-size: 16px; font-weight: 400; letter-spacing: 0; line-height: 120%; text-align: left; mso-line-height-alt: 19.2px; list-style-type: disc;">
																		<li style="margin-bottom: 0; text-align: left;">Establecimiento: {{sportCenterName}}</li>
																		<li style="margin-bottom: 0; text-align: left;">Direccion: {{sportCenterAddress}} - {{nameCity}}</li>
																		<li style="margin-bottom: 0; text-align: left;">Fecha: {{date}}</li>
																		<li style="margin-bottom: 0; text-align: left;">Hora: {{startTime}}hs - {{endTime}}hs</li>
																		<li style="margin-bottom: 0; text-align: left;">Cancha: {{courtId}}</li>
																		<li style="margin-bottom: 0; text-align: left;">Valor: {{price}}</li>
																		<li style="margin-bottom: 0; text-align: left;">Estado: <strong>PENDIENTE DE CONFIRMACION</strong></li>
																	</ul>
																</div>
															</td>
														</tr>
													</table>
													<table class="image_block block-6" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:60px;width:100%;">
																<div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2991/easter-basket.jpg" style="display: block; height: auto; border: 0; max-width: 640px; width: 100%;" width="640" alt="Sports Easter Basket" title="Sports Easter Basket"></div>
															</td>
														</tr>
													</table>
													<table class="divider_block block-7" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="85%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #00A779;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-3" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9fdbad; color: #000; width: 640px; margin: 0 auto;" width="640">
										<tbody>
											<tr>
												<td class="column column-1" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:20px;width:100%;">
																<div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2991/racket.png" style="display: block; height: auto; border: 0; max-width: 300px; width: 100%;" width="300" alt="Tennis Racket and Ball" title="Tennis Racket and Ball"></div>
															</td>
														</tr>
													</table>
												</td>
												<td class="column column-2" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:5px;padding-left:35px;padding-right:35px;padding-top:5px;">
																<div style="color:#434852;font-family:Hind, Nunito, Arial, sans-serif;font-size:24px;line-height:120%;text-align:left;mso-line-height-alt:28.799999999999997px;">
																	<p style="margin: 0;">Proba nuevos deportes</p>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-2" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
													<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-left:35px;padding-right:35px;">
																<div style="color:#333333;font-family:Hind, Nunito, Arial, sans-serif;font-size:16px;line-height:180%;text-align:left;mso-line-height-alt:28.8px;">
																	<p style="margin: 0; word-break: break-word;"><span>Ya sea si tu pasión es el tenis, futbol, pádel, seguro tenemos una opción para vos.. Pero porque no animarse a probar algo nuevo? Te aseguraremos que será&nbsp;divertido!</span></p>
																</div>
															</td>
														</tr>
													</table>
													<table class="button_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad" style="padding-bottom:20px;padding-left:35px;padding-right:10px;padding-top:20px;text-align:left;">
																<div class="alignment" align="left"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://dondejugamos.vercel.app/" style="height:42px;width:174px;v-text-anchor:middle;" arcsize="53%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#00a779; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://dondejugamos.vercel.app/" target="_blank" style="text-decoration:none;display:inline-block;color:#00a779;background-color:#ffffff;border-radius:22px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Hind, Nunito, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Quiero reservar</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-5" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-4" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9fdbad; color: #000; width: 640px; margin: 0 auto;" width="640">
										<tbody>
											<tr class="reverse">
												<td class="column column-1 first" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="border">
														<table class="paragraph_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
															<tr>
																<td class="pad" style="padding-bottom:5px;padding-left:35px;padding-right:35px;padding-top:5px;">
																	<div style="color:#434852;font-family:Hind, Nunito, Arial, sans-serif;font-size:24px;line-height:120%;text-align:left;mso-line-height-alt:28.799999999999997px;">
																		<p style="margin: 0; word-break: break-word;"><span><strong><span>Tus reservas en un solo lugar</span></strong></span></p>
																	</div>
																</td>
															</tr>
														</table>
														<div class="spacer_block block-2" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
														<table class="paragraph_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
															<tr>
																<td class="pad" style="padding-left:35px;padding-right:35px;">
																	<div style="color:#333333;font-family:Hind, Nunito, Arial, sans-serif;font-size:16px;line-height:180%;text-align:left;mso-line-height-alt:28.8px;">
																		<p style="margin: 0; word-break: break-word;"><span>Explora las distintas opciones en tu ciudad, consulta horarios y turnos disponibles, y elegí la que mejor se adapte a vos y a tu equipo.&nbsp;</span></p>
																	</div>
																</td>
															</tr>
														</table>
														<table class="button_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
															<tr>
																<td class="pad" style="padding-bottom:20px;padding-left:35px;padding-right:10px;padding-top:20px;text-align:left;">
																	<div class="alignment" align="left"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://dondejugamos.vercel.app/" style="height:42px;width:178px;v-text-anchor:middle;" arcsize="53%" stroke="false" fillcolor="#ffffff"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#00a779; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href="https://dondejugamos.vercel.app/" target="_blank" style="text-decoration:none;display:inline-block;color:#00a779;background-color:#ffffff;border-radius:22px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:5px;padding-bottom:5px;font-family:Hind, Nunito, Arial, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:35px;padding-right:35px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="word-break: break-word; line-height: 32px;">Quiero reservar!</span></span></a><!--[if mso]></center></v:textbox></v:roundrect><![endif]--></div>
																</td>
															</tr>
														</table>
														<div class="spacer_block block-5" style="height:35px;line-height:35px;font-size:1px;">&#8202;</div>
													</div>
												</td>
												<td class="column column-2 last" width="50%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="border">
														<table class="image_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
															<tr>
																<td class="pad" style="padding-bottom:20px;padding-left:10px;padding-right:10px;padding-top:20px;width:100%;">
																	<div class="alignment" align="center" style="line-height:10px"><img src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/2991/shoe-and-ball.png" style="display: block; height: auto; border: 0; max-width: 300px; width: 100%;" width="300" alt="Athletic Shoe and Ball" title="Athletic Shoe and Ball"></div>
																</td>
															</tr>
														</table>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-5" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #9fdbad; color: #000; width: 640px; margin: 0 auto;" width="640">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 30px; padding-top: 20px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<table class="divider_block block-1" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
																		<tr>
																			<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 1px solid #525466;"><span>&#8202;</span></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-2" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
													<table class="social_block block-3" width="100%" border="0" cellpadding="10" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
														<tr>
															<td class="pad">
																<div class="alignment" align="center">
																	<table class="social-table" width="156px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; display: inline-block;">
																		<tr>
																			<td style="padding:0 10px 0 10px;"><a href="https://www.facebook.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-dark-gray/facebook@2x.png" width="32" height="32" alt="Facebook" title="facebook" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 10px 0 10px;"><a href="https://www.twitter.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-dark-gray/twitter@2x.png" width="32" height="32" alt="Twitter" title="twitter" style="display: block; height: auto; border: 0;"></a></td>
																			<td style="padding:0 10px 0 10px;"><a href="https://www.instagram.com" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/t-outline-circle-dark-gray/instagram@2x.png" width="32" height="32" alt="Instagram" title="instagram" style="display: block; height: auto; border: 0;"></a></td>
																		</tr>
																	</table>
																</div>
															</td>
														</tr>
													</table>
													<div class="spacer_block block-4" style="height:15px;line-height:15px;font-size:1px;">&#8202;</div>
													<table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;">
														<tr>
															<td class="pad" style="padding-bottom:5px;padding-left:10px;padding-right:10px;padding-top:5px;">
																<div style="font-family: sans-serif">
																	<div class style="font-size: 12px; font-family: Hind, Nunito, Arial, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #434852; line-height: 1.2;">
																		<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 16.8px;"><span style="font-size:12px;">© 2023 Donde Jugamos | Entre Rios, Argentina</span></p>
																	</div>
																</div>
															</td>
														</tr>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
					<table class="row row-6" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
						<tbody>
							<tr>
								<td>
									<table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; color: #000; width: 640px; margin: 0 auto;" width="640">
										<tbody>
											<tr>
												<td class="column column-1" width="100%" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;">
													<div class="spacer_block block-1" style="height:20px;line-height:20px;font-size:1px;">&#8202;</div>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table><!-- End -->
</body>

</html>`;

export const compileNewReservationTemplate = (
  sportCenterName: string,
  sportCenterAddress: string,
  date: string,
  nameCity: string,
  startTime: string,
  endTime: string,
  courtId: string,
  price: string,
) => {
  const template = handlebars.compile(NewReservationTemplate);
  const htmlBody = template({
    sportCenterName,
    sportCenterAddress,
    date,
    nameCity,
    startTime,
    endTime,
    courtId,
    price,
  });

  return htmlBody;
};
